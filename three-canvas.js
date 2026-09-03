import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
const canvas=document.getElementById("toothCanvas");
if(canvas){
 const scene=new THREE.Scene();
 const camera=new THREE.PerspectiveCamera(35,1,.1,100);camera.position.set(0,0,5.2);
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:devicePixelRatio<2});
 renderer.setPixelRatio(Math.min(devicePixelRatio, window.innerWidth<700?1.25:2));
 renderer.setSize(canvas.clientWidth,canvas.clientHeight,false);
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 const group=new THREE.Group();scene.add(group);
 const mat=new THREE.MeshPhysicalMaterial({color:0xf4fbff,roughness:.18,metalness:.03,clearcoat:.7,clearcoatRoughness:.14});
 const root=new THREE.Group();group.add(root);
 const crown=new THREE.Mesh(new THREE.SphereGeometry(1.22,48,32),mat);crown.scale.set(.78,1.03,.66);root.add(crown);
 const neck=new THREE.Mesh(new THREE.CylinderGeometry(.58,.8,.75,40),mat);neck.position.y=-.72;neck.scale.z=.85;root.add(neck);
 const rootA=new THREE.Mesh(new THREE.ConeGeometry(.35,1.25,32),mat);rootA.position.set(-.32,-1.32,.02);rootA.rotation.z=-.08;rootA.scale.y=1.1;root.add(rootA);
 const rootB=rootA.clone();rootB.position.x=.32;rootB.rotation.z=.08;root.add(rootB);
 const groove=new THREE.Mesh(new THREE.TorusGeometry(.48,.018,8,64),new THREE.MeshBasicMaterial({color:0x00e5ff,transparent:true,opacity:.6}));groove.rotation.x=Math.PI/2;groove.position.y=.15;root.add(groove);
 const cyan=new THREE.PointLight(0x00e5ff,18,8);cyan.position.set(2,1.5,3);scene.add(cyan);
 const gold=new THREE.PointLight(0xd7b36a,12,7);gold.position.set(-2,-1,2);scene.add(gold);
 scene.add(new THREE.AmbientLight(0x8095b5,1.7));
 let targetX=0,targetY=0,rx=0,ry=0,drag=false,lastX=0,lastY=0,vx=0,vy=0;
 function pointer(x,y){const r=canvas.getBoundingClientRect();targetX=(x-r.left)/r.width-.5;targetY=(y-r.top)/r.height-.5}
 canvas.addEventListener("pointerdown",e=>{drag=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture?.(e.pointerId)});
 canvas.addEventListener("pointermove",e=>{if(drag){vx+=(e.clientX-lastX)*.001;vy+=(e.clientY-lastY)*.001;lastX=e.clientX;lastY=e.clientY}else pointer(e.clientX,e.clientY)});
 canvas.addEventListener("pointerup",()=>drag=false);canvas.addEventListener("pointercancel",()=>drag=false);
 window.addEventListener("resize",()=>{renderer.setSize(canvas.clientWidth,canvas.clientHeight,false);camera.aspect=canvas.clientWidth/canvas.clientHeight;camera.updateProjectionMatrix()});
 let last=0;
 function frame(t){requestAnimationFrame(frame);const mobile=innerWidth<700;const interval=mobile?1000/30:1000/60;if(t-last<interval)return;last=t;
   ry+=(targetX*.55+vx-ry)*.045;rx+=(targetY*.25+vy-rx)*.045;vx*=.92;vy*=.92;group.rotation.y+=.0025+ry*.008;group.rotation.y+=vx;group.rotation.x=rx;cyan.position.x=2+targetX*2;cyan.position.y=1.5-targetY;
   renderer.render(scene,camera);
 }requestAnimationFrame(frame);
}
