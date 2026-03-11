    import React, { useEffect, useRef, useState, useCallback } from "react";
    import * as THREE from "three";
    import { useSpring, useSpringRef, animated, to } from "@react-spring/web";

    // ─── BRIGHT GOLDEN face textures ─────────────────────────────────────────────
    function makeFaceTexture(emoji, label, sublabel) {
    const cv = document.createElement("canvas");
    cv.width = cv.height = 512;
    const ctx = cv.getContext("2d");

    // Bright vivid gold gradient
    const g = ctx.createLinearGradient(0, 0, 512, 512);
    g.addColorStop(0,    "#c4a219db");
    g.addColorStop(0.25, "#ffc200");
    g.addColorStop(0.5,  "#fffbe8");
    g.addColorStop(0.75, "#ffb700");
    g.addColorStop(1,    "#bdac17");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 512);

    // Brilliant shine sweep
    const shine = ctx.createLinearGradient(50, 0, 300, 512);
    shine.addColorStop(0,    "rgba(255,255,255,0)");
    shine.addColorStop(0.4,  "rgba(255,255,255,0.22)");
    shine.addColorStop(0.5,  "rgba(255,255,255,0.48)");
    shine.addColorStop(0.6,  "rgba(255,255,255,0.22)");
    shine.addColorStop(1,    "rgba(255,255,255,0)");
    ctx.fillStyle = shine;
    ctx.fillRect(0, 0, 512, 512);

    // Outer border — bright white-gold
    ctx.strokeStyle = "rgba(255,255,220,0.98)"; ctx.lineWidth = 13;
    ctx.strokeRect(12, 12, 488, 488);
    ctx.strokeStyle = "rgba(223, 181, 15, 0.65)";  ctx.lineWidth = 5;
    ctx.strokeRect(26, 26, 460, 460);
    ctx.strokeStyle = "rgba(255,255,200,0.35)"; ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, 432, 432);

    // Bright corner jewels
    for (const [cx, cy] of [[12,12],[500,12],[12,500],[500,500]]) {
        const jg = ctx.createRadialGradient(cx,cy,0,cx,cy,16);
        jg.addColorStop(0,"rgba(255,255,255,1)");
        jg.addColorStop(0.4,"rgba(255,230,80,0.9)");
        jg.addColorStop(1,"rgba(255,180,0,0.6)");
        ctx.beginPath(); ctx.arc(cx,cy,16,0,Math.PI*2);
        ctx.fillStyle=jg; ctx.fill();
    }

    // Fine filigree lines
    ctx.strokeStyle = "rgba(255,255,200,0.18)"; ctx.lineWidth = 1.5;
    for (let i = 0; i < 20; i++) {
        ctx.beginPath(); ctx.moveTo(i*28,0); ctx.lineTo(0,i*28); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(512-i*28,512); ctx.lineTo(512,512-i*28); ctx.stroke();
    }

    // Emoji with blazing glow
    ctx.font = "128px serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.shadowColor = "#ffffff"; ctx.shadowBlur = 30;
    ctx.fillStyle = "#fff8e0";
    ctx.fillText(emoji, 256, 185);

    // Embossed label
    ctx.shadowBlur = 0;
    ctx.font = "bold 56px serif";
    ctx.fillStyle = "rgba(120,60,0,0.55)";
    ctx.fillText(label, 258, 352);
    ctx.fillStyle = "#fff5c0";
    ctx.fillText(label, 256, 350);

    if (sublabel) {
        ctx.font = "bold 32px serif";
        ctx.fillStyle = "rgba(100,50,0,0.4)";
        ctx.fillText(sublabel, 258, 407);
        ctx.fillStyle = "rgba(255,245,180,0.9)";
        ctx.fillText(sublabel, 256, 405);
    }

    return new THREE.CanvasTexture(cv);
    }

    function makeLidTexture() {
    const cv = document.createElement("canvas");
    cv.width = cv.height = 512;
    const ctx = cv.getContext("2d");

    const g = ctx.createRadialGradient(256,256,10,256,256,320);
    g.addColorStop(0,   "#ffe566");
    g.addColorStop(0.3, "#ffbb00");
    g.addColorStop(0.7, "#c87800");
    g.addColorStop(1,   "#7a4400");
    ctx.fillStyle = g; ctx.fillRect(0,0,512,512);

    // Bright center shine
    const shine = ctx.createRadialGradient(200,160,0,256,256,280);
    shine.addColorStop(0,"rgba(255,255,255,0.45)");
    shine.addColorStop(0.5,"rgba(255,255,200,0.15)");
    shine.addColorStop(1,"rgba(255,255,255,0)");
    ctx.fillStyle=shine; ctx.fillRect(0,0,512,512);

    ctx.strokeStyle="rgba(255,255,220,0.98)"; ctx.lineWidth=13;
    ctx.strokeRect(12,12,488,488);
    ctx.strokeStyle="rgba(255,220,80,0.6)"; ctx.lineWidth=5;
    ctx.strokeRect(26,26,460,460);

    ctx.strokeStyle="rgba(255,255,200,0.15)"; ctx.lineWidth=1.5;
    for(let i=0;i<20;i++){
        ctx.beginPath();ctx.moveTo(i*28,0);ctx.lineTo(0,i*28);ctx.stroke();
        ctx.beginPath();ctx.moveTo(512-i*28,512);ctx.lineTo(512,512-i*28);ctx.stroke();
    }

    ctx.font="200px serif";
    ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.shadowColor="#ffffff"; ctx.shadowBlur=50;
    ctx.fillStyle="#fff8d0";
    ctx.fillText("🎀",256,256);

    return new THREE.CanvasTexture(cv);
    }

    // (3D text plane removed — text is now pure CSS overlay for max beauty)

    const FACE_DEFS = [
    ["🌙","عيد","Eid"],
    ["☪️","مبارك","Mubarak"],
    ["⭐","بركة","Bless"],
    ["🎁","هدية","Gift"],
    ["🕌","رمضان","Ramadan"],
    ["✨","سعيد","Happy"],
    ];

    // ─── COMPONENT ────────────────────────────────────────────────────────────────
    export default function SurpriseBox() {
    const mountRef = useRef(null);
    const threeRef = useRef({
        phase: "idle",
        openT: 0, autoRot: 0,
        confOpacity: 0, overlayDone: false,
        lidPivot: null, root: null,
        confetti: null, confVel: null,
        dust: null,
        keyLight: null, fillLight: null,
        goldLight1: null, goldLight2: null,
        topSpot: null, innerGlow: null,
        ring: null, ring2: null,
        CONF: 700, W: 2.4, H: 2.4,
    });

    const [showCSS, setShowCSS] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);

    // Spring for the full overlay: rises from bottom into center
    const overlaySpring = useSpring({
        opacity: showOverlay ? 1 : 0,
        y: showOverlay ? 0 : 120,
        scale: showOverlay ? 1 : 0.4,
        config: { tension: 160, friction: 18 },
    });

    // CSS gold confetti burst — REMOVED

    useEffect(()=>{
        const mount = mountRef.current;
        if(!mount) return;
        const tr = threeRef.current;

        // Scene — black background
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);

        const camera = new THREE.PerspectiveCamera(50,mount.clientWidth/mount.clientHeight,0.1,100);
        camera.position.set(0,1.5,8);
        camera.lookAt(0,0.2,0);

        const renderer = new THREE.WebGLRenderer({antialias:true});
        renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
        renderer.setSize(mount.clientWidth,mount.clientHeight);
        renderer.shadowMap.enabled=true;
        renderer.shadowMap.type=THREE.PCFSoftShadowMap;
        renderer.toneMapping=THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure=1.6;  // brighter!
        mount.appendChild(renderer.domElement);

        // ── LIGHTS — blazing bright gold ──────────────────────────────────────
        scene.add(new THREE.AmbientLight(0xffe0a0, 0.8)); // warm bright ambient

        const keyLight=new THREE.PointLight(0xffee66,6,32); scene.add(keyLight); tr.keyLight=keyLight;
        const fillLight=new THREE.PointLight(0xffcc00,4,28); scene.add(fillLight); tr.fillLight=fillLight;

        const goldLight1=new THREE.PointLight(0xfff4c0,5,22);
        goldLight1.position.set(0,7,-4); scene.add(goldLight1); tr.goldLight1=goldLight1;
        const goldLight2=new THREE.PointLight(0xffdd44,4,20);
        goldLight2.position.set(0,-2,6); scene.add(goldLight2); tr.goldLight2=goldLight2;

        // Inner glow light — starts off, blazes when box opens
        const innerGlow=new THREE.PointLight(0xffffff,0,15);
        innerGlow.position.set(0,0,0); scene.add(innerGlow); tr.innerGlow=innerGlow;

        const topSpot=new THREE.SpotLight(0xffd700,10,28,Math.PI/6,.3);
        topSpot.position.set(0,12,2); topSpot.castShadow=true;
        topSpot.shadow.mapSize.set(2048,2048);
        scene.add(topSpot); scene.add(topSpot.target); tr.topSpot=topSpot;

        // ── STARS — bright gold tinted ────────────────────────────────────────
        const starGeo=new THREE.BufferGeometry();
        const sp=new Float32Array(1800*3), sc=new Float32Array(1800*3);
        for(let i=0;i<1800;i++){
        sp[i*3]=(Math.random()-.5)*90;
        sp[i*3+1]=(Math.random()-.5)*90;
        sp[i*3+2]=(Math.random()-.5)*90;
        sc[i*3]=0.95+Math.random()*.05;
        sc[i*3+1]=0.8+Math.random()*.2;
        sc[i*3+2]=0.1+Math.random()*.3;
        }
        starGeo.setAttribute("position",new THREE.BufferAttribute(sp,3));
        starGeo.setAttribute("color",new THREE.BufferAttribute(sc,3));
        scene.add(new THREE.Points(starGeo,
        new THREE.PointsMaterial({size:.07,vertexColors:true,transparent:true,opacity:.85})));

        // ── MATERIALS ─────────────────────────────────────────────────────────
        const {W,H}=tr;
        const LT=0.16, OV=0.1;

        // Mirror-polish gold
        const goldMat=new THREE.MeshStandardMaterial({
        color:0xffcc33, metalness:1.0, roughness:0.02, envMapIntensity:2.5,
        });
        const goldDarkMat=new THREE.MeshStandardMaterial({
        color:0xe09000, metalness:1.0, roughness:0.1
        });

        // Bright shiny face materials
        const faceMats=FACE_DEFS.map(([e,l,s])=>
        new THREE.MeshStandardMaterial({
            map:makeFaceTexture(e,l,s), metalness:0.8, roughness:0.12, envMapIntensity:2.0
        })
        );

        // ── ROOT ──────────────────────────────────────────────────────────────
        const root=new THREE.Group();
        scene.add(root); tr.root=root;

        const body=new THREE.Mesh(new THREE.BoxGeometry(W,H,W),faceMats);
        body.castShadow=true; body.receiveShadow=true;
        root.add(body);

        // Thick shiny ribbons
        root.add(new THREE.Mesh(new THREE.BoxGeometry(W+.08,.24,W+.08),goldMat));
        root.add(new THREE.Mesh(new THREE.BoxGeometry(.24,H+.08,W+.08),goldMat));
        root.add(new THREE.Mesh(new THREE.BoxGeometry(W+.08,H+.08,.24),goldMat));

        // Double glow rings under box
        const mkRing=(inn,out,y,op)=>{
        const m=new THREE.Mesh(
            new THREE.RingGeometry(inn,out,80),
            new THREE.MeshBasicMaterial({color:0xffd700,transparent:true,opacity:op,side:THREE.DoubleSide})
        );
        m.rotation.x=-Math.PI/2; m.position.y=y; root.add(m); return m;
        };
        tr.ring =mkRing(1.5,2.2,-H/2-.02,.2);
        tr.ring2=mkRing(0.7,1.4,-H/2-.01,.12);

        // ── LID PIVOT ─────────────────────────────────────────────────────────
        const lidPivot=new THREE.Group();
        lidPivot.position.set(0,H/2,-W/2);
        root.add(lidPivot); tr.lidPivot=lidPivot;

        const lidMesh=new THREE.Mesh(
        new THREE.BoxGeometry(W+OV*2,LT,W+OV*2),
        new THREE.MeshStandardMaterial({
            map:makeLidTexture(), metalness:.9, roughness:.08, envMapIntensity:2.5
        })
        );
        lidMesh.position.set(0,LT/2,W/2);
        lidPivot.add(lidMesh);

        // Lid ribbons
        const lrH=new THREE.Mesh(new THREE.BoxGeometry(W+OV*2+.08,LT+.05,.24),goldMat);
        lrH.position.set(0,LT/2,W/2); lidPivot.add(lrH);
        const lrV=new THREE.Mesh(new THREE.BoxGeometry(.24,LT+.05,W+OV*2+.08),goldMat);
        lrV.position.set(0,LT/2,W/2); lidPivot.add(lrV);

        // Big bow
        for(const[dx,rz]of[[-0.29,.44],[.29,-.44]]){
        const t=new THREE.Mesh(new THREE.TorusGeometry(.24,.082,10,30),goldMat);
        t.position.set(dx,LT+.27,W/2); t.rotation.z=rz; lidPivot.add(t);
        }
        const knot=new THREE.Mesh(new THREE.SphereGeometry(.12,12,12),goldDarkMat);
        knot.position.set(0,LT+.27,W/2); lidPivot.add(knot);

        // Ribbon tails
        for(const[dx,dz,rz]of[[-1.1,W/2,.26],[1.1,W/2,-.26],[0,W*.88,.08]]){
        const tail=new THREE.Mesh(new THREE.BoxGeometry(.13,.48,.08),goldMat);
        tail.position.set(dx,LT+.06,dz); tail.rotation.z=rz; lidPivot.add(tail);
        }

        // ── 3D GOLD CONFETTI ──────────────────────────────────────────────────
        const CONF=tr.CONF;
        const cPos=new Float32Array(CONF*3);
        const cCol=new Float32Array(CONF*3);
        const cVel=new Float32Array(CONF*3);
        const gPal=[[1,.84,0],[1,.75,0],[1,.93,.4],[1,.97,.65],[.9,.65,0],[1,1,.72]];
        for(let i=0;i<CONF;i++){
        cPos[i*3]   =(Math.random()-.5)*W*.8;
        cPos[i*3+1] =Math.random()*H*.4-H*.42;
        cPos[i*3+2] =(Math.random()-.5)*W*.8;
        cVel[i*3]   =(Math.random()-.5)*.07;
        cVel[i*3+1] =.05+Math.random()*.12;
        cVel[i*3+2] =(Math.random()-.5)*.07;
        const gc=gPal[~~(Math.random()*gPal.length)];
        cCol[i*3]=gc[0]; cCol[i*3+1]=gc[1]; cCol[i*3+2]=gc[2];
        }
        const cGeo=new THREE.BufferGeometry();
        cGeo.setAttribute("position",new THREE.BufferAttribute(cPos,3));
        cGeo.setAttribute("color",new THREE.BufferAttribute(cCol,3));
        const confetti=new THREE.Points(cGeo,
        new THREE.PointsMaterial({size:.1,vertexColors:true,transparent:true,opacity:0})
        );
        scene.add(confetti); tr.confetti=confetti; tr.confVel=cVel;

        // Floating gold dust
        const dGeo=new THREE.BufferGeometry();
        const dp=new Float32Array(280*3);
        for(let i=0;i<280*3;i++) dp[i]=(Math.random()-.5)*16;
        dGeo.setAttribute("position",new THREE.BufferAttribute(dp,3));
        const dust=new THREE.Points(dGeo,
        new THREE.PointsMaterial({color:0xffd700,size:.05,transparent:true,opacity:.45})
        );
        scene.add(dust); tr.dust=dust;

        // ── CLICK ──────────────────────────────────────────────────────────────
        renderer.domElement.addEventListener("click",()=>{
        if(tr.phase!=="idle") return;
        tr.phase="opening"; tr.openT=0;
        });

        // ── RENDER LOOP ────────────────────────────────────────────────────────
        let raf;
        const clock=new THREE.Clock();
        const OPEN_DUR=1.3;

        const animate=()=>{
        raf=requestAnimationFrame(animate);
        const dt=Math.min(clock.getDelta(),.05);
        const t=clock.getElapsedTime();

        // Orbiting gold lights
        tr.keyLight.position.set(Math.sin(t*.55)*7,4,Math.cos(t*.55)*6);
        tr.fillLight.position.set(Math.cos(t*.42)*6,-1,Math.sin(t*.42)*5);
        tr.goldLight1.position.set(Math.sin(t*.3+1)*5,7,Math.cos(t*.3+1)*4);
        tr.goldLight2.position.set(Math.cos(t*.38)*4,-2,Math.sin(t*.38)*5);

        // Shimmer — pulsing light intensities
        tr.keyLight.intensity  = 6+Math.sin(t*2.1)*1.5;
        tr.fillLight.intensity = 4+Math.sin(t*1.7+1)*1.0;
        tr.goldLight1.intensity= 5+Math.sin(t*2.8+2)*1.8;

        tr.dust.rotation.y=t*.08;
        tr.dust.material.opacity=.3+Math.sin(t*1.5)*.18;

        // ── IDLE ──
        if(tr.phase==="idle"){
            tr.autoRot+=dt*.5;
            tr.root.rotation.y=tr.autoRot;
            tr.root.rotation.x=Math.sin(t*.42)*.08;
            tr.root.position.y=Math.sin(t*.88)*.09;
            tr.ring.material.opacity =.12+Math.sin(t*1.2)*.09;
            tr.ring2.material.opacity=.07+Math.sin(t*1.7)*.05;
        }

        // ── OPENING ──
        if(tr.phase==="opening"){
            tr.openT+=dt;
            const raw=Math.min(tr.openT/OPEN_DUR,1);
            let ease;
            if(raw<.7){ ease=1-Math.pow(1-raw/.7,2.5); }
            else { const r=(raw-.7)/.3; ease=1+Math.sin(r*Math.PI)*.06*(1-r); }

            // Lid swings open
            tr.lidPivot.rotation.x=-ease*Math.PI*.88;
            tr.root.rotation.y+=dt*.12;
            tr.root.position.y=Math.sin(raw*Math.PI)*.24;
            tr.ring.material.opacity =.14+raw*.2;
            tr.ring2.material.opacity=.08+raw*.14;

            // Inner glow builds as lid opens
            tr.innerGlow.intensity=ease*12;

            if(raw>=1){
            tr.phase="open";
            tr.textRising=true;
            tr.textRiseT=0;
            }
        }

        // ── OPEN ──
        if(tr.phase==="open"){
            tr.root.rotation.y+=dt*.16;
            tr.root.position.y=Math.sin(t*.7)*.07;
            tr.topSpot.intensity=10+Math.sin(t*2.5)*4;
            tr.innerGlow.intensity=8+Math.sin(t*3)*4;
            tr.ring.material.opacity =.2+Math.sin(t*2)*.14;
            tr.ring2.material.opacity=.12+Math.sin(t*2.4)*.09;

            // Gold confetti physics
            tr.confOpacity=Math.min(tr.confOpacity+dt*2.5,1);
            confetti.material.opacity=tr.confOpacity;
            const pos=confetti.geometry.attributes.position.array;
            const vel=tr.confVel;
            for(let i=0;i<CONF;i++){
            pos[i*3]  +=vel[i*3];
            pos[i*3+1]+=vel[i*3+1];
            pos[i*3+2]+=vel[i*3+2];
            vel[i*3+1]-=.001;
            if(pos[i*3+1]>7){
                pos[i*3]  =(Math.random()-.5)*W*.8;
                pos[i*3+1]=-H*.4;
                pos[i*3+2]=(Math.random()-.5)*W*.8;
                vel[i*3+1]=.05+Math.random()*.12;
            }
            }
            confetti.geometry.attributes.position.needsUpdate=true;

            if(!tr.overlayDone){
            tr.overlayDone=true;
            setTimeout(()=>cssBurst(),400);
            setTimeout(()=>setShowCSS(true),400);
            setTimeout(()=>setShowOverlay(true),600);
            }
        }

        renderer.render(scene,camera);
        };
        animate();

        const onResize=()=>{
        camera.aspect=mount.clientWidth/mount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth,mount.clientHeight);
        };
        window.addEventListener("resize",onResize);

        return()=>{
        cancelAnimationFrame(raf);
        window.removeEventListener("resize",onResize);
        renderer.dispose();
        if(mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
        };
    },[]);

    return (
        <div style={{position:"relative",width:"100vw",height:"100vh",overflow:"hidden",cursor:"pointer",background:"#140a00"}}>

        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap');

            @keyframes hintPulse{
            0%,100%{opacity:.4;transform:translateX(-50%) translateY(0)}
            50%{opacity:1;transform:translateX(-50%) translateY(-7px)}
            }
            @keyframes eidFly{
            0%{opacity:1;transform:translateY(0) rotate(0deg) scale(1)}
            100%{opacity:0;transform:translateY(120vh) rotate(800deg) scale(.06)}
            }
            @keyframes goldSweep{
            0%{background-position:0% 50%}
            50%{background-position:100% 50%}
            100%{background-position:0% 50%}
            }
            @keyframes blazePulse{
            0%,100%{
                text-shadow:
                0 0 20px #ffd700,
                0 0 50px #ffaa00,
                0 0 90px #ff8800,
                0 0 140px #ff6600;
            }
            50%{
                text-shadow:
                0 0 30px #fff5a0,
                0 0 70px #ffd700,
                0 0 120px #ffaa00,
                0 0 200px #ff8800;
            }
            }
            @keyframes subGlow{
            0%,100%{text-shadow:0 0 12px #ffd700,0 0 28px #ffaa00}
            50%{text-shadow:0 0 22px #ffe566,0 0 50px #ffd700}
            }
            @keyframes dividerShine{
            0%{opacity:.5;transform:scaleX(.6)}
            50%{opacity:1;transform:scaleX(1)}
            100%{opacity:.5;transform:scaleX(.6)}
            }
            @keyframes floatText{
            0%,100%{transform:translateY(0)}
            50%{transform:translateY(-8px)}
            }
            @keyframes fromAfanIn{
            0%{opacity:0;transform:translateY(18px) scale(.92)}
            100%{opacity:1;transform:translateY(0) scale(1)}
            }
        `}</style>

        {/* Three.js canvas */}
        <div ref={mountRef} style={{width:"100%",height:"100%"}}/>

        {/* CSS confetti */}
        <div id="eid-confetti" style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:25}}/>

        {/* Click hint */}
        {!showCSS&&(
            <div style={{
            position:"absolute",bottom:36,left:"50%",
            fontFamily:"'Cinzel Decorative',cursive",
            fontSize:13,letterSpacing:5,textTransform:"uppercase",
            color:"rgba(255,220,80,.95)",whiteSpace:"nowrap",
            animation:"hintPulse 2.2s ease-in-out infinite",
            pointerEvents:"none",zIndex:20,
            textShadow:"0 0 20px #ffd700,0 0 40px #ffaa00",
            }}>
            ✦ Click The Box ✦
            </div>
        )}

        {/* ── CENTERED TEXT OVERLAY — pure glowing text, no card ── */}
        <animated.div style={{
            position:"absolute", inset:0,
            display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center",
            pointerEvents:"none", zIndex:40,
            opacity: overlaySpring.opacity,
            transform: overlaySpring.y.to(y=>
            `translateY(${y}px) scale(${overlaySpring.scale.get()})`
            ),
            gap:0,
        }}>

            {/* ✦ decorative top sparkles */}
            <div style={{
            fontSize:"clamp(18px,3vw,28px)",
            color:"rgba(255,215,0,.9)",
            textShadow:"0 0 20px #ffd700",
            marginBottom:6,
            animation:"floatText 3s ease-in-out infinite",
            letterSpacing:18,
            }}>
            ✦ ✦ ✦
            </div>

            {/* Main title — BLAZING GOLD */}
            <div style={{
            fontFamily:"'Cinzel Decorative',cursive",
            fontWeight:900,
            fontSize:"clamp(48px,11vw,120px)",
            lineHeight:1.05,
            background:"linear-gradient(135deg, #7a4000 0%, #ffd700 18%, #fffbe0 38%, #ffd700 52%, #ffaa00 68%, #ffe566 82%, #ffd700 100%)",
            backgroundSize:"300% 300%",
            WebkitBackgroundClip:"text",
            backgroundClip:"text",
            color:"transparent",
            animation:"goldSweep 2.8s ease-in-out infinite, blazePulse 2.5s ease-in-out infinite",
            textAlign:"center",
            letterSpacing:4,
            padding:"0 20px",
            WebkitTextStroke:"1px rgba(255,200,50,0.15)",
            }}>
            Eid Mubarak
            </div>

            {/* Gold shimmer divider */}
            <div style={{
            width:"min(520px,75vw)", height:2,
            background:"linear-gradient(90deg,transparent,#ffd700,#fffacd,#ffd700,transparent)",
            boxShadow:"0 0 18px #ffd700, 0 0 40px rgba(255,180,0,.5)",
            margin:"16px auto",
            animation:"dividerShine 2.5s ease-in-out infinite",
            }}/>

            {/* Arabic */}
            <div style={{
            fontFamily:"'Amiri',serif",
            fontWeight:700,
            fontSize:"clamp(36px,7vw,88px)",
            background:"linear-gradient(135deg,#ffd700,#fffbe8,#ffcc00)",
            backgroundSize:"200% 200%",
            WebkitBackgroundClip:"text",
            backgroundClip:"text",
            color:"transparent",
            animation:"goldSweep 3s ease-in-out infinite",
            textShadow:"none",
            filter:"drop-shadow(0 0 30px rgba(255,200,0,.95)) drop-shadow(0 0 70px rgba(255,140,0,.6))",
            textAlign:"center",
            letterSpacing:6,
            }}>
            عيد مبارك
            </div>

            {/* Sub blessing */}
            <div style={{
            fontFamily:"'Amiri',serif",
            fontSize:"clamp(14px,2.8vw,28px)",
            color:"rgba(255,235,150,.95)",
            letterSpacing:4,
            marginTop:14,
            animation:"subGlow 2.5s ease-in-out infinite, floatText 4s ease-in-out infinite",
            textAlign:"center",
            padding:"0 24px",
            }}>
            ✦ Wishing You Joy, Peace &amp; Endless Blessings ✦
            </div>

            {/* Thin second divider */}
            <div style={{
            width:"min(320px,55vw)", height:1,
            background:"linear-gradient(90deg,transparent,rgba(255,215,0,.6),transparent)",
            margin:"14px auto",
            }}/>

            {/* "from Afan" — elegant italic, appears with delay */}
            <div style={{
            fontFamily:"'Amiri',serif",
            fontStyle:"italic",
            fontSize:"clamp(16px,3vw,34px)",
            background:"linear-gradient(90deg,#ffcc44,#ffe8a0,#ffcc44)",
            backgroundSize:"200% 200%",
            WebkitBackgroundClip:"text",
            backgroundClip:"text",
            color:"transparent",
            animation:`goldSweep 3.5s ease-in-out infinite, fromAfanIn .9s .5s cubic-bezier(.16,1,.3,1) both`,
            letterSpacing:5,
            textAlign:"center",
            filter:"drop-shadow(0 0 16px rgba(255,180,0,.8))",
            }}>
            — from Afan Qaiser Farooqi 🌙 —
            </div>

            {/* Bottom sparkles */}
            <div style={{
            fontSize:"clamp(16px,2.5vw,24px)",
            color:"rgba(255,215,0,.8)",
            textShadow:"0 0 16px #ffd700",
            marginTop:10,
            letterSpacing:14,
            animation:"floatText 3.5s .5s ease-in-out infinite",
            }}>
            ✦ ✦ ✦
            </div>

        </animated.div>
        </div>
    );
    }