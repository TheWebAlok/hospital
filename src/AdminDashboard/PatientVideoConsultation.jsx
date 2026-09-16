import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { io } from "socket.io-client";

import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MonitorUp,
  MonitorOff,
  MessageCircle,
  Send,
  ArrowLeft,
  Stethoscope,
} from "lucide-react";

import "./PatientVideoConsultation.css";

// =====================================================
// SOCKET SERVER
// =====================================================

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  "http://localhost:5000";
// =====================================================
// ICE / STUN
// =====================================================

const rtcConfiguration = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
    {
      urls: "stun:stun1.l.google.com:19302",
    },
  ],
};

export default function PatientVideoConsultation() {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  // ===================================================
  // MEETING ID
  // ===================================================

  const meetingId =
    searchParams.get("meetingId");

  // ===================================================
  // REFS
  // ===================================================

  const socketRef = useRef(null);

  const localVideoRef =
    useRef(null);

  const remoteVideoRef =
    useRef(null);

  const localStreamRef =
    useRef(null);

  const peerConnectionRef =
    useRef(null);

  const screenStreamRef =
    useRef(null);

  const pendingCandidatesRef =
    useRef([]);

  const messagesEndRef =
    useRef(null);

  // ===================================================
  // STATE
  // ===================================================

  const [socketConnected, setSocketConnected] =
    useState(false);

  const [doctorConnected, setDoctorConnected] =
    useState(false);

  const [micEnabled, setMicEnabled] =
    useState(true);

  const [cameraEnabled, setCameraEnabled] =
    useState(true);

  const [screenSharing, setScreenSharing] =
    useState(false);

  const [showChat, setShowChat] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [error, setError] =
    useState("");

  // ===================================================
  // USER
  // ===================================================

  const storedUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const patientName =
    storedUser.name || "Patient";

  // ===================================================
  // START CAMERA + MICROPHONE
  // ===================================================

  const startLocalMedia = async () => {
    try {
      setError("");

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        setError(
          "Camera access is not supported by this browser."
        );

        return null;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: true,
            audio: true,
          }
        );

      localStreamRef.current =
        stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject =
          stream;
      }

      return stream;
    } catch (err) {
      console.error(
        "Camera/Microphone Error:",
        err
      );

      setError(
        "Please allow camera and microphone permission."
      );

      return null;
    }
  };

  // ===================================================
  // CREATE PEER CONNECTION
  // ===================================================

  const createPeerConnection =
    () => {
      if (
        peerConnectionRef.current
      ) {
        return peerConnectionRef.current;
      }

      const peerConnection =
        new RTCPeerConnection(
          rtcConfiguration
        );

      peerConnectionRef.current =
        peerConnection;

      // -----------------------------------------------
      // Add local tracks
      // -----------------------------------------------

      if (
        localStreamRef.current
      ) {
        localStreamRef.current
          .getTracks()
          .forEach((track) => {
            peerConnection.addTrack(
              track,
              localStreamRef.current
            );
          });
      }

      // -----------------------------------------------
      // Receive doctor stream
      // -----------------------------------------------

      peerConnection.ontrack = (
        event
      ) => {
        console.log(
          "Doctor remote stream received"
        );

        const [remoteStream] =
          event.streams;

        if (
          remoteVideoRef.current &&
          remoteStream
        ) {
          remoteVideoRef.current.srcObject =
            remoteStream;

          setDoctorConnected(true);
        }
      };

      // -----------------------------------------------
      // ICE candidates
      // -----------------------------------------------

      peerConnection.onicecandidate =
        (event) => {
          if (
            event.candidate &&
            socketRef.current
          ) {
            socketRef.current.emit(
              "webrtc-ice-candidate",
              {
                meetingId,
                candidate:
                  event.candidate,
              }
            );
          }
        };

      // -----------------------------------------------
      // Connection state
      // -----------------------------------------------

      peerConnection.onconnectionstatechange =
        () => {
          const state =
            peerConnection.connectionState;

          console.log(
            "WebRTC connection:",
            state
          );

          if (
            state === "connected"
          ) {
            setDoctorConnected(true);
          }

          if (
            state === "disconnected" ||
            state === "failed" ||
            state === "closed"
          ) {
            setDoctorConnected(false);
          }
        };

      return peerConnection;
    };

  // ===================================================
  // HANDLE OFFER
  // ===================================================

  const handleOffer = async (
    offer
  ) => {
    try {
      const peerConnection =
        createPeerConnection();

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(
          offer
        )
      );

      // -----------------------------------------------
      // Add pending ICE candidates
      // -----------------------------------------------

      for (const candidate of
        pendingCandidatesRef.current) {
        try {
          await peerConnection.addIceCandidate(
            new RTCIceCandidate(
              candidate
            )
          );
        } catch (err) {
          console.error(
            "Pending ICE error:",
            err
          );
        }
      }

      pendingCandidatesRef.current =
        [];

      // -----------------------------------------------
      // Create answer
      // -----------------------------------------------

      const answer =
        await peerConnection.createAnswer();

      await peerConnection.setLocalDescription(
        answer
      );

      socketRef.current?.emit(
        "webrtc-answer",
        {
          meetingId,
          answer,
        }
      );

      console.log(
        "WebRTC answer sent"
      );
    } catch (err) {
      console.error(
        "Offer handling error:",
        err
      );

      setError(
        "Unable to connect to doctor."
      );
    }
  };

  // ===================================================
  // HANDLE ICE
  // ===================================================

  const handleIceCandidate =
    async (candidate) => {
      try {
        const peerConnection =
          peerConnectionRef.current;

        if (
          !peerConnection ||
          !peerConnection.remoteDescription
        ) {
          pendingCandidatesRef.current.push(
            candidate
          );

          return;
        }

        await peerConnection.addIceCandidate(
          new RTCIceCandidate(
            candidate
          )
        );
      } catch (err) {
        console.error(
          "ICE candidate error:",
          err
        );
      }
    };

  // ===================================================
  // SOCKET INITIALIZATION
  // ===================================================

  useEffect(() => {
    let active = true;

    if (!meetingId) {
      setError(
        "Meeting ID is missing."
      );

      return;
    }

    const initialize = async () => {
      // -----------------------------------------------
      // Camera
      // -----------------------------------------------

      const stream =
        await startLocalMedia();

      if (!stream || !active) {
        return;
      }

      // -----------------------------------------------
      // Socket
      // -----------------------------------------------

      const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
});

      socketRef.current =
        socket;

      // -----------------------------------------------
      // Connected
      // -----------------------------------------------

      socket.on(
        "connect",
        () => {
          console.log(
            "Socket connected:",
            socket.id
          );

          setSocketConnected(
            true
          );

          socket.emit(
            "join-video-room",
            {
              meetingId,
              userId:
                storedUser._id ||
                storedUser.id,
              userName:
                patientName,
              role: "patient",
            }
          );
        }
      );

      // -----------------------------------------------
      // Doctor joined
      // -----------------------------------------------

      socket.on(
        "user-joined",
        (data) => {
          console.log(
            "User joined:",
            data
          );

          if (
            data?.role ===
            "doctor"
          ) {
            setDoctorConnected(
              true
            );

            // Patient does NOT create offer.
            // Doctor creates offer.
            createPeerConnection();
          }
        }
      );

      // -----------------------------------------------
      // Patient joined event
      // -----------------------------------------------

      socket.on(
        "patient-joined",
        () => {
          console.log(
            "Patient joined room"
          );
        }
      );

      // -----------------------------------------------
      // Existing participants
      // -----------------------------------------------

      socket.on(
        "existing-participants",
        (participants) => {
          console.log(
            "Existing participants:",
            participants
          );

          const doctor =
            participants?.find(
              (participant) =>
                participant.role ===
                "doctor"
            );

          if (doctor) {
            setDoctorConnected(
              true
            );

            createPeerConnection();
          }
        }
      );

      // -----------------------------------------------
      // WebRTC Offer
      // -----------------------------------------------

      socket.on(
        "webrtc-offer",
        async (data) => {
          if (
            data?.offer
          ) {
            await handleOffer(
              data.offer
            );
          }
        }
      );

      // -----------------------------------------------
      // WebRTC Answer
      // -----------------------------------------------

      socket.on(
        "webrtc-answer",
        () => {
          // Patient normally doesn't
          // create an offer.
          console.log(
            "WebRTC answer received"
          );
        }
      );

      // -----------------------------------------------
      // ICE
      // -----------------------------------------------

      socket.on(
        "webrtc-ice-candidate",
        async (data) => {
          if (
            data?.candidate
          ) {
            await handleIceCandidate(
              data.candidate
            );
          }
        }
      );

      // -----------------------------------------------
      // Doctor left
      // -----------------------------------------------

      socket.on(
        "user-left",
        (data) => {
          if (
            data?.role ===
            "doctor"
          ) {
            setDoctorConnected(
              false
            );

            if (
              remoteVideoRef.current
            ) {
              remoteVideoRef.current.srcObject =
                null;
            }
          }
        }
      );

      // -----------------------------------------------
      // Chat
      // -----------------------------------------------

      socket.on(
        "video-chat-message",
        (data) => {
          setMessages(
            (previous) => [
              ...previous,
              {
                id:
                  Date.now() +
                  Math.random(),
                sender:
                  data.sender ||
                  "Doctor",
                message:
                  data.message,
                own: false,
              },
            ]
          );
        }
      );

      // -----------------------------------------------
      // Disconnect
      // -----------------------------------------------

      socket.on(
        "disconnect",
        () => {
          console.log(
            "Socket disconnected"
          );

          setSocketConnected(
            false
          );
        }
      );
    };

    initialize();

    // =================================================
    // CLEANUP
    // =================================================

    return () => {
      active = false;

      if (
        socketRef.current
      ) {
        socketRef.current.emit(
          "leave-video-room",
          {
            meetingId,
          }
        );

        socketRef.current.disconnect();

        socketRef.current =
          null;
      }

      if (
        peerConnectionRef.current
      ) {
        peerConnectionRef.current.close();

        peerConnectionRef.current =
          null;
      }

      if (
        localStreamRef.current
      ) {
        localStreamRef.current
          .getTracks()
          .forEach((track) =>
            track.stop()
          );

        localStreamRef.current =
          null;
      }

      if (
        screenStreamRef.current
      ) {
        screenStreamRef.current
          .getTracks()
          .forEach((track) =>
            track.stop()
          );

        screenStreamRef.current =
          null;
      }
    };
  }, [meetingId]);

  // ===================================================
  // MICROPHONE
  // ===================================================

  const toggleMicrophone =
    () => {
      if (
        !localStreamRef.current
      ) {
        return;
      }

      const audioTracks =
        localStreamRef.current.getAudioTracks();

      audioTracks.forEach(
        (track) => {
          track.enabled =
            !track.enabled;
        }
      );

      setMicEnabled(
        (previous) =>
          !previous
      );
    };

  // ===================================================
  // CAMERA
  // ===================================================

  const toggleCamera = () => {
    if (
      !localStreamRef.current
    ) {
      return;
    }

    const videoTracks =
      localStreamRef.current.getVideoTracks();

    videoTracks.forEach(
      (track) => {
        track.enabled =
          !track.enabled;
      }
    );

    setCameraEnabled(
      (previous) =>
        !previous
    );
  };

  // ===================================================
  // SCREEN SHARE
  // ===================================================

  const toggleScreenShare =
    async () => {
      try {
        const peerConnection =
          peerConnectionRef.current;

        if (!peerConnection) {
          return;
        }

        if (!screenSharing) {
          const screenStream =
            await navigator.mediaDevices.getDisplayMedia(
              {
                video: true,
              }
            );

          screenStreamRef.current =
            screenStream;

          const screenTrack =
            screenStream.getVideoTracks()[0];

          const sender =
            peerConnection
              .getSenders()
              .find(
                (item) =>
                  item.track?.kind ===
                  "video"
              );

          if (sender) {
            await sender.replaceTrack(
              screenTrack
            );
          }

          screenTrack.onended =
            () => {
              stopScreenShare();
            };

          setScreenSharing(
            true
          );
        } else {
          await stopScreenShare();
        }
      } catch (err) {
        console.error(
          "Screen share error:",
          err
        );
      }
    };

  // ===================================================
  // STOP SCREEN SHARE
  // ===================================================

  const stopScreenShare =
    async () => {
      try {
        const cameraTrack =
          localStreamRef.current?.getVideoTracks()[0];

        const sender =
          peerConnectionRef.current
            ?.getSenders()
            .find(
              (item) =>
                item.track?.kind ===
                "video"
            );

        if (
          sender &&
          cameraTrack
        ) {
          await sender.replaceTrack(
            cameraTrack
          );
        }

        if (
          screenStreamRef.current
        ) {
          screenStreamRef.current
            .getTracks()
            .forEach((track) =>
              track.stop()
            );

          screenStreamRef.current =
            null;
        }

        setScreenSharing(
          false
        );
      } catch (err) {
        console.error(
          "Stop screen share error:",
          err
        );
      }
    };

  // ===================================================
  // CHAT
  // ===================================================

  const sendMessage = (
    event
  ) => {
    event.preventDefault();

    const trimmed =
      message.trim();

    if (!trimmed) {
      return;
    }

    socketRef.current?.emit(
      "video-chat-message",
      {
        meetingId,
        sender: patientName,
        role: "patient",
        message: trimmed,
      }
    );

    setMessages(
      (previous) => [
        ...previous,
        {
          id:
            Date.now() +
            Math.random(),
          sender:
            patientName,
          message:
            trimmed,
          own: true,
        },
      ]
    );

    setMessage("");
  };

  // ===================================================
  // CHAT AUTO SCROLL
  // ===================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView(
      {
        behavior: "smooth",
      }
    );
  }, [messages]);

  // ===================================================
  // END CALL
  // ===================================================

  const endCall = () => {
    if (
      socketRef.current
    ) {
      socketRef.current.emit(
        "leave-video-room",
        {
          meetingId,
        }
      );
    }

    if (
      peerConnectionRef.current
    ) {
      peerConnectionRef.current.close();

      peerConnectionRef.current =
        null;
    }

    if (
      localStreamRef.current
    ) {
      localStreamRef.current
        .getTracks()
        .forEach((track) =>
          track.stop()
        );
    }

    navigate(
      "/patient/appointments"
    );
  };

  // ===================================================
  // NO MEETING ID
  // ===================================================

  if (!meetingId) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
        }}
      >
        <h2>
          Invalid Video Consultation
        </h2>

        <p>
          Meeting ID is missing.
        </p>

        <button
          onClick={() =>
            navigate(
              "/patient/appointments"
            )
          }
        >
          Back to Appointments
        </button>
      </div>
    );
  }

  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="patient-video-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="patient-video-header">

        <div className="patient-video-header-left">

          <button
            type="button"
            className="patient-video-back"
            onClick={() =>
              navigate(
                "/patient/appointments"
              )
            }
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <h2>
              Video Consultation
            </h2>

            <p>
              Meeting ID:{" "}
              {meetingId}
            </p>
          </div>

        </div>

        <div className="patient-video-status">

          <span
            className={
              socketConnected
                ? "status-dot online"
                : "status-dot"
            }
          />

          {socketConnected
            ? "Connected"
            : "Connecting..."}

        </div>

      </header>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="patient-video-error">
          {error}
        </div>
      )}

      {/* =================================================
          VIDEO AREA
      ================================================= */}

      <main className="patient-video-main">

        {/* DOCTOR VIDEO */}

        <div className="patient-remote-video-box">

          <video
            ref={
              remoteVideoRef
            }
            autoPlay
            playsInline
            className="patient-remote-video"
          />

          {!doctorConnected && (
            <div className="patient-waiting">

              <div className="patient-waiting-icon">
                <Stethoscope
                  size={42}
                />
              </div>

              <h3>
                Waiting for Doctor
              </h3>

              <p>
                Please wait for the
                doctor to join the
                consultation.
              </p>

            </div>
          )}

          <div className="patient-remote-name">
            <Stethoscope size={16} />
            Doctor
          </div>

        </div>

        {/* PATIENT SELF VIDEO */}

        <div className="patient-local-video-box">

          <video
            ref={
              localVideoRef
            }
            autoPlay
            muted
            playsInline
            className="patient-local-video"
          />

          {!cameraEnabled && (
            <div className="patient-camera-off">
              <VideoOff
                size={28}
              />

              <span>
                Camera Off
              </span>
            </div>
          )}

          <div className="patient-local-name">
            {patientName}
          </div>

        </div>

        {/* =================================================
            CONTROLS
        ================================================= */}

        <div className="patient-video-controls">

          {/* MIC */}

          <button
            type="button"
            className={`patient-control ${
              !micEnabled
                ? "control-off"
                : ""
            }`}
            onClick={
              toggleMicrophone
            }
            title={
              micEnabled
                ? "Mute"
                : "Unmute"
            }
          >
            {micEnabled ? (
              <Mic size={21} />
            ) : (
              <MicOff size={21} />
            )}
          </button>

          {/* CAMERA */}

          <button
            type="button"
            className={`patient-control ${
              !cameraEnabled
                ? "control-off"
                : ""
            }`}
            onClick={
              toggleCamera
            }
            title={
              cameraEnabled
                ? "Turn camera off"
                : "Turn camera on"
            }
          >
            {cameraEnabled ? (
              <Video size={21} />
            ) : (
              <VideoOff size={21} />
            )}
          </button>

          {/* SCREEN SHARE */}

          <button
            type="button"
            className={`patient-control ${
              screenSharing
                ? "control-active"
                : ""
            }`}
            onClick={
              toggleScreenShare
            }
            title="Share Screen"
          >
            {screenSharing ? (
              <MonitorOff
                size={21}
              />
            ) : (
              <MonitorUp
                size={21}
              />
            )}
          </button>

          {/* CHAT */}

          <button
            type="button"
            className={`patient-control ${
              showChat
                ? "control-active"
                : ""
            }`}
            onClick={() =>
              setShowChat(
                (previous) =>
                  !previous
              )
            }
            title="Chat"
          >
            <MessageCircle
              size={21}
            />
          </button>

          {/* END */}

          <button
            type="button"
            className="patient-end-call"
            onClick={endCall}
            title="End Consultation"
          >
            <PhoneOff size={21} />
          </button>

        </div>

        {/* =================================================
            CHAT
        ================================================= */}

        {showChat && (
          <div className="patient-chat-panel">

            <div className="patient-chat-header">

              <div>
                <strong>
                  Consultation Chat
                </strong>

                <span>
                  Doctor
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowChat(false)
                }
              >
                ×
              </button>

            </div>

            <div className="patient-chat-messages">

              {messages.length ===
                0 && (
                <div className="patient-empty-chat">
                  No messages yet.
                </div>
              )}

              {messages.map(
                (item) => (
                  <div
                    key={item.id}
                    className={`patient-chat-message ${
                      item.own
                        ? "patient-chat-own"
                        : "patient-chat-other"
                    }`}
                  >
                    <span>
                      {item.sender}
                    </span>

                    <p>
                      {item.message}
                    </p>
                  </div>
                )
              )}

              <div
                ref={
                  messagesEndRef
                }
              />

            </div>

            <form
              className="patient-chat-form"
              onSubmit={
                sendMessage
              }
            >

              <input
                type="text"
                value={message}
                onChange={(event) =>
                  setMessage(
                    event.target.value
                  )
                }
                placeholder="Type a message..."
              />

              <button type="submit">
                <Send size={18} />
              </button>

            </form>

          </div>
        )}

      </main>
    </div>
  );
}