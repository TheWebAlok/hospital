
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
      Users,
      ArrowLeft,
} from "lucide-react";

import "./DoctorVideoConsultation.css";

// =====================================================
// SOCKET SERVER
// Change this according to your backend
// =====================================================

const SOCKET_URL =
      import.meta.env.VITE_SOCKET_URL ||
      "http://localhost:5000";


export default function DoctorVideoConsultation() {
      const navigate = useNavigate();
      const [searchParams] = useSearchParams();

      // =====================================================
      // MEETING ID
      // =====================================================

      const meetingId =
            searchParams.get("meetingId") || "doctor-patient-demo";

      // =====================================================
      // REFS
      // =====================================================

      const socketRef = useRef(null);

      const localVideoRef = useRef(null);
      const remoteVideoRef = useRef(null);

      const localStreamRef = useRef(null);
      const peerConnectionRef = useRef(null);

      const screenStreamRef = useRef(null);

      const messagesEndRef = useRef(null);

      // =====================================================
      // STATE
      // =====================================================

      const [micEnabled, setMicEnabled] = useState(true);
      const [cameraEnabled, setCameraEnabled] = useState(true);
      const [screenSharing, setScreenSharing] = useState(false);

      const [connected, setConnected] = useState(false);
      const [patientConnected, setPatientConnected] =
            useState(false);

      const [messages, setMessages] = useState([]);
      const [message, setMessage] = useState("");

      const [showChat, setShowChat] = useState(false);

      const [error, setError] = useState("");

      // =====================================================
      // STUN SERVERS
      // =====================================================

      const iceServers = {
            iceServers: [
                  {
                        urls: "stun:stun.l.google.com:19302",
                  },
                  {
                        urls: "stun:stun1.l.google.com:19302",
                  },
            ],
      };

      // =====================================================
      // GET USER
      // =====================================================

      const storedUser = JSON.parse(
            localStorage.getItem("user") || "{}"
      );

      const doctorName =
            storedUser.name || "Doctor";

      // =====================================================
      // START LOCAL MEDIA
      // =====================================================

      const startLocalMedia = async () => {
            try {
                  setError("");

                  const stream =
                        await navigator.mediaDevices.getUserMedia({
                              video: true,
                              audio: true,
                        });

                  localStreamRef.current = stream;

                  if (localVideoRef.current) {
                        localVideoRef.current.srcObject = stream;
                  }

                  return stream;
            } catch (err) {
                  console.error(
                        "Camera/Microphone error:",
                        err
                  );

                  setError(
                        "Camera and microphone permission is required."
                  );

                  return null;
            }
      };

      // =====================================================
      // CREATE PEER CONNECTION
      // =====================================================

      const createPeerConnection = () => {
            const peerConnection =
                  new RTCPeerConnection(iceServers);

            peerConnectionRef.current =
                  peerConnection;

            // ---------------------------------------------------
            // Add Doctor Tracks
            // ---------------------------------------------------

            if (localStreamRef.current) {
                  localStreamRef.current
                        .getTracks()
                        .forEach((track) => {
                              peerConnection.addTrack(
                                    track,
                                    localStreamRef.current
                              );
                        });
            }

            // ---------------------------------------------------
            // Receive Patient Stream
            // ---------------------------------------------------

            peerConnection.ontrack = (event) => {
                  console.log(
                        "Remote patient stream received"
                  );

                  if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject =
                              event.streams[0];
                  }

                  setPatientConnected(true);
            };

            // ---------------------------------------------------
            // ICE Candidate
            // ---------------------------------------------------

            peerConnection.onicecandidate =
                  (event) => {
                        if (event.candidate) {
                              socketRef.current?.emit(
                                    "webrtc-ice-candidate",
                                    {
                                          meetingId,
                                          candidate: event.candidate,
                                    }
                              );
                        }
                  };

            peerConnection.onconnectionstatechange =
                  () => {
                        const state =
                              peerConnection.connectionState;

                        console.log(
                              "WebRTC state:",
                              state
                        );

                        if (state === "connected") {
                              setPatientConnected(true);
                        }

                        if (
                              state === "disconnected" ||
                              state === "failed" ||
                              state === "closed"
                        ) {
                              setPatientConnected(false);
                        }
                  };

            return peerConnection;
      };

      // =====================================================
      // CREATE OFFER
      // =====================================================

      const createOffer = async () => {
            try {
                  if (!peerConnectionRef.current) {
                        createPeerConnection();
                  }

                  const peerConnection =
                        peerConnectionRef.current;

                  const offer =
                        await peerConnection.createOffer();

                  await peerConnection.setLocalDescription(
                        offer
                  );

                  socketRef.current.emit(
                        "webrtc-offer",
                        {
                              meetingId,
                              offer,
                        }
                  );
            } catch (err) {
                  console.error(
                        "Offer error:",
                        err
                  );
            }
      };

      // =====================================================
      // HANDLE OFFER
      // =====================================================

      const handleOffer = async (offer) => {
            try {
                  if (!peerConnectionRef.current) {
                        createPeerConnection();
                  }

                  const peerConnection =
                        peerConnectionRef.current;

                  await peerConnection.setRemoteDescription(
                        new RTCSessionDescription(offer)
                  );

                  const answer =
                        await peerConnection.createAnswer();

                  await peerConnection.setLocalDescription(
                        answer
                  );

                  socketRef.current.emit(
                        "webrtc-answer",
                        {
                              meetingId,
                              answer,
                        }
                  );
            } catch (err) {
                  console.error(
                        "Offer handling error:",
                        err
                  );
            }
      };

      // =====================================================
      // HANDLE ANSWER
      // =====================================================

      const handleAnswer = async (answer) => {
            try {
                  const peerConnection =
                        peerConnectionRef.current;

                  if (!peerConnection) return;

                  await peerConnection.setRemoteDescription(
                        new RTCSessionDescription(answer)
                  );
            } catch (err) {
                  console.error(
                        "Answer error:",
                        err
                  );
            }
      };

      // =====================================================
      // HANDLE ICE
      // =====================================================

      const handleIceCandidate = async (
            candidate
      ) => {
            try {
                  const peerConnection =
                        peerConnectionRef.current;

                  if (!peerConnection) return;

                  await peerConnection.addIceCandidate(
                        new RTCIceCandidate(candidate)
                  );
            } catch (err) {
                  console.error(
                        "ICE candidate error:",
                        err
                  );
            }
      };

      // =====================================================
      // SOCKET CONNECTION
      // =====================================================

      useEffect(() => {
            let mounted = true;

            const initialize = async () => {
                  const stream =
                        await startLocalMedia();

                  if (!stream || !mounted) {
                        return;
                  }

                  const socket = io(SOCKET_URL, {
                        transports: ["websocket", "polling"],
                  });

                  socketRef.current = socket;

                  // -------------------------------------------------
                  // Socket Connected
                  // -------------------------------------------------

                  socket.on("connect", () => {
                        console.log(
                              "Socket connected:",
                              socket.id
                        );

                        setConnected(true);

                        socket.emit("join-video-room", {
                              meetingId,
                              userId: storedUser._id,
                              userName: doctorName,
                              role: "doctor",
                        });
                  });

                  // -------------------------------------------------
                  // Patient Joined
                  // -------------------------------------------------

                  socket.on(
                        "patient-joined",
                        async () => {
                              console.log(
                                    "Patient joined"
                              );

                              setPatientConnected(true);

                              createPeerConnection();

                              await createOffer();
                        }
                  );

                  // -------------------------------------------------
                  // Generic User Joined
                  // -------------------------------------------------

                  socket.on(
                        "user-joined",
                        async (data) => {
                              if (
                                    data?.role === "patient"
                              ) {
                                    setPatientConnected(true);

                                    if (
                                          !peerConnectionRef.current
                                    ) {
                                          createPeerConnection();
                                    }

                                    await createOffer();
                              }
                        }
                  );

                  // -------------------------------------------------
                  // Offer
                  // -------------------------------------------------

                  socket.on(
                        "webrtc-offer",
                        async (data) => {
                              if (data?.offer) {
                                    await handleOffer(
                                          data.offer
                                    );
                              }
                        }
                  );

                  // -------------------------------------------------
                  // Answer
                  // -------------------------------------------------

                  socket.on(
                        "webrtc-answer",
                        async (data) => {
                              if (data?.answer) {
                                    await handleAnswer(
                                          data.answer
                                    );
                              }
                        }
                  );

                  // -------------------------------------------------
                  // ICE Candidate
                  // -------------------------------------------------

                  socket.on(
                        "webrtc-ice-candidate",
                        async (data) => {
                              if (data?.candidate) {
                                    await handleIceCandidate(
                                          data.candidate
                                    );
                              }
                        }
                  );

                  // -------------------------------------------------
                  // Patient Left
                  // -------------------------------------------------

                  socket.on(
                        "patient-left",
                        () => {
                              setPatientConnected(false);

                              if (remoteVideoRef.current) {
                                    remoteVideoRef.current.srcObject =
                                          null;
                              }
                        }
                  );

                  // -------------------------------------------------
                  // Chat
                  // -------------------------------------------------

                  socket.on(
                        "video-chat-message",
                        (data) => {
                              setMessages((prev) => [
                                    ...prev,
                                    {
                                          id:
                                                Date.now() +
                                                Math.random(),
                                          sender:
                                                data.sender ||
                                                "Patient",
                                          message:
                                                data.message,
                                          own: false,
                                    },
                              ]);
                        }
                  );
            };

            initialize();

            // ===================================================
            // CLEANUP
            // ===================================================

            return () => {
                  mounted = false;

                  if (socketRef.current) {
                        socketRef.current.emit(
                              "leave-video-room",
                              {
                                    meetingId,
                              }
                        );

                        socketRef.current.disconnect();
                        socketRef.current = null;
                  }

                  if (
                        peerConnectionRef.current
                  ) {
                        peerConnectionRef.current.close();
                        peerConnectionRef.current = null;
                  }

                  if (
                        localStreamRef.current
                  ) {
                        localStreamRef.current
                              .getTracks()
                              .forEach((track) =>
                                    track.stop()
                              );

                        localStreamRef.current = null;
                  }

                  if (
                        screenStreamRef.current
                  ) {
                        screenStreamRef.current
                              .getTracks()
                              .forEach((track) =>
                                    track.stop()
                              );

                        screenStreamRef.current = null;
                  }
            };
      }, []);

      // =====================================================
      // MICROPHONE
      // =====================================================

      const toggleMicrophone = () => {
            if (!localStreamRef.current)
                  return;

            const audioTracks =
                  localStreamRef.current.getAudioTracks();

            audioTracks.forEach(
                  (track) => {
                        track.enabled = !track.enabled;
                  }
            );

            setMicEnabled((prev) => !prev);
      };

      // =====================================================
      // CAMERA
      // =====================================================

      const toggleCamera = () => {
            if (!localStreamRef.current)
                  return;

            const videoTracks =
                  localStreamRef.current.getVideoTracks();

            videoTracks.forEach(
                  (track) => {
                        track.enabled = !track.enabled;
                  }
            );

            setCameraEnabled(
                  (prev) => !prev
            );
      };

      // =====================================================
      // SCREEN SHARE
      // =====================================================

      const toggleScreenShare =
            async () => {
                  try {
                        if (
                              !peerConnectionRef.current
                        ) {
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
                                    peerConnectionRef.current
                                          .getSenders()
                                          .find(
                                                (s) =>
                                                      s.track?.kind ===
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

                              setScreenSharing(true);
                        } else {
                              stopScreenShare();
                        }
                  } catch (err) {
                        console.error(
                              "Screen sharing error:",
                              err
                        );
                  }
            };

      // =====================================================
      // STOP SCREEN SHARE
      // =====================================================

      const stopScreenShare = async () => {
            try {
                  const cameraTrack =
                        localStreamRef.current?.getVideoTracks()[0];

                  const sender =
                        peerConnectionRef.current
                              ?.getSenders()
                              .find(
                                    (s) =>
                                          s.track?.kind ===
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

                  setScreenSharing(false);
            } catch (err) {
                  console.error(
                        "Stop screen share error:",
                        err
                  );
            }
      };

      // =====================================================
      // SEND CHAT
      // =====================================================

      const sendMessage = (e) => {
            e.preventDefault();

            const trimmed =
                  message.trim();

            if (!trimmed) return;

            const chatMessage = {
                  meetingId,
                  sender: doctorName,
                  role: "doctor",
                  message: trimmed,
            };

            socketRef.current?.emit(
                  "video-chat-message",
                  chatMessage
            );

            setMessages((prev) => [
                  ...prev,
                  {
                        id:
                              Date.now() +
                              Math.random(),
                        sender: doctorName,
                        message: trimmed,
                        own: true,
                  },
            ]);

            setMessage("");
      };

      // =====================================================
      // AUTO SCROLL CHAT
      // =====================================================

      useEffect(() => {
            messagesEndRef.current?.scrollIntoView({
                  behavior: "smooth",
            });
      }, [messages]);

      // =====================================================
      // END CALL
      // =====================================================

      const endCall = () => {
            socketRef.current?.emit(
                  "leave-video-room",
                  {
                        meetingId,
                  }
            );

            if (
                  localStreamRef.current
            ) {
                  localStreamRef.current
                        .getTracks()
                        .forEach((track) =>
                              track.stop()
                        );
            }

            if (
                  peerConnectionRef.current
            ) {
                  peerConnectionRef.current.close();
            }

            navigate(
                  "/doctor/appointments"
            );
      };

      // =====================================================
      // UI
      // =====================================================

      return (
            <div className="doctor-video-page">

                  {/* =================================================
          HEADER
      ================================================= */}

                  <div className="video-page-header">

                        <div className="video-header-left">

                              <button
                                    type="button"
                                    className="video-back-btn"
                                    onClick={() =>
                                          navigate(
                                                "/doctor/appointments"
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

                        <div className="video-header-status">

                              <span
                                    className={
                                          connected
                                                ? "status-dot online"
                                                : "status-dot"
                                    }
                              />

                              {connected
                                    ? "Connected"
                                    : "Connecting..."}

                        </div>

                  </div>

                  {/* =================================================
          ERROR
      ================================================= */}

                  {error && (
                        <div className="video-error">
                              {error}
                        </div>
                  )}

                  {/* =================================================
          VIDEO AREA
      ================================================= */}

                  <div className="video-main-area">

                        {/* PATIENT VIDEO */}

                        <div className="remote-video-container">

                              <video
                                    ref={remoteVideoRef}
                                    autoPlay
                                    playsInline
                                    className="remote-video"
                              />

                              {!patientConnected && (
                                    <div className="waiting-patient">

                                          <div className="waiting-icon">
                                                <Users size={42} />
                                          </div>

                                          <h3>
                                                Waiting for patient
                                          </h3>

                                          <p>
                                                Ask the patient to join
                                                the consultation.
                                          </p>

                                    </div>
                              )}

                              <div className="remote-name">
                                    <Users size={16} />
                                    Patient
                              </div>

                        </div>

                        {/* DOCTOR VIDEO */}

                        <div className="local-video-container">

                              <video
                                    ref={localVideoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    className="local-video"
                              />

                              {!cameraEnabled && (
                                    <div className="camera-off-overlay">
                                          <VideoOff size={30} />
                                          <span>
                                                Camera Off
                                          </span>
                                    </div>
                              )}

                              <div className="local-name">
                                    {doctorName}
                              </div>

                        </div>

                        {/* =================================================
            CONTROLS
        ================================================= */}

                        <div className="video-controls">

                              {/* MIC */}

                              <button
                                    type="button"
                                    className={`video-control-btn ${!micEnabled
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
                                    className={`video-control-btn ${!cameraEnabled
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
                                    className={`video-control-btn ${screenSharing
                                                ? "control-active"
                                                : ""
                                          }`}
                                    onClick={
                                          toggleScreenShare
                                    }
                                    title={
                                          screenSharing
                                                ? "Stop screen sharing"
                                                : "Share screen"
                                    }
                              >
                                    {screenSharing ? (
                                          <MonitorOff size={21} />
                                    ) : (
                                          <MonitorUp size={21} />
                                    )}
                              </button>

                              {/* CHAT */}

                              <button
                                    type="button"
                                    className={`video-control-btn ${showChat
                                                ? "control-active"
                                                : ""
                                          }`}
                                    onClick={() =>
                                          setShowChat(
                                                (prev) => !prev
                                          )
                                    }
                                    title="Chat"
                              >
                                    <MessageCircle
                                          size={21}
                                    />
                              </button>

                              {/* END CALL */}

                              <button
                                    type="button"
                                    className="video-end-call-btn"
                                    onClick={endCall}
                                    title="End consultation"
                              >
                                    <PhoneOff size={21} />
                              </button>

                        </div>

                        {/* =================================================
            CHAT PANEL
        ================================================= */}

                        {showChat && (
                              <div className="video-chat-panel">

                                    <div className="video-chat-header">

                                          <div>
                                                <strong>
                                                      Consultation Chat
                                                </strong>

                                                <span>
                                                      Patient
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

                                    <div className="video-chat-messages">

                                          {messages.length ===
                                                0 && (
                                                      <div className="empty-chat">
                                                            No messages yet.
                                                      </div>
                                                )}

                                          {messages.map(
                                                (item) => (
                                                      <div
                                                            key={item.id}
                                                            className={`chat-message ${item.own
                                                                        ? "chat-own"
                                                                        : "chat-other"
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
                                          className="video-chat-form"
                                          onSubmit={
                                                sendMessage
                                          }
                                    >

                                          <input
                                                type="text"
                                                value={message}
                                                onChange={(e) =>
                                                      setMessage(
                                                            e.target.value
                                                      )
                                                }
                                                placeholder="Type a message..."
                                          />

                                          <button
                                                type="submit"
                                          >
                                                <Send size={18} />
                                          </button>

                                    </form>

                              </div>
                        )}

                  </div>

            </div>
      );
}
