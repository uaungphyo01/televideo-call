<script>
let localStream;
let peerConnection;
const servers = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

async function startCall() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;

        peerConnection = new RTCPeerConnection(servers);
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        peerConnection.ontrack = event => {
            remoteVideo.srcObject = event.streams[0];
        };

        peerConnection.onicecandidate = event => {
            if (event.candidate) {
                // တကယ် ဆာဗာနဲ့ ချိတ်မှ ဒီကနေ signal ပို့ရမယ်
                console.log('ICE Candidate:', event.candidate);
            }
        };

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        // ဒီ offer ကို တခြား user ကို ပို့ပြီး answer ပြန်ယူရမယ်
        alert('Demo: Offer ဖန်တီးပြီးပါပြီ။ တကယ်ချိတ်ဖို့ backend လိုအပ်ပါသည်။');
    } catch (err) {
        alert('ဗီဒီယိုခေါ်ဆိုမှု မအောင်မြင်ပါ - ' + err.message);
    }
}

function endCall() {
    if (peerConnection) peerConnection.close();
    if (localStream) localStream.getTracks().forEach(t => t.stop());
    localVideo.srcObject = null;
    remoteVideo.srcObject = null;
}

function closeModal() {
    document.getElementById('videoCallModal').style.display = 'none';
    endCall();
}

// အခု ရှိပြီးသား startVideoCall() ကို ပြင်ပါ
function startVideoCall() {
    document.getElementById('videoCallModal').style.display = 'block';
}
</script>