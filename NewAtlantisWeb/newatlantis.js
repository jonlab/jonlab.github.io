import { GLTFLoader } from './examples/jsm/loaders/GLTFLoader.js';
import { Water } from './examples/jsm/objects/Water.js';
import { Sky } from './examples/jsm/objects/Sky.js';
import Stats from './examples/jsm/libs/stats.module.js';
import { CannonPhysics } from './examples/jsm/physics/CannonPhysics.js';


const PhysicsEnabled = false;
/**
 * NEW ATLANTIS WEB POC
 */
var camera;
var MovingForward = false;
var MovingBackward = false;
var MovingLeft = false;
var MovingRight = false;
var MouseDrag = false;
var ObjectDrag = false;


var scene; //Three js 3D scene
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var physics;

var avatarname = "";
var main_timer = 0;
var send_timer = 0;
var avatar_dirty = false;
var avatar_speed = 0.1;

var space_objects = [];  //overall objects
var objects = []; //THREE objects
var objects_main = [];

var water;
var cubeCamera;

var selection; //current target
var object_selection;
var listener;
var fontLoader;
var gltfLoader;
var font;
var audioContext;
var renderer; //THREE renderer
var patch;
var gui;
var parameters;
var inputFile;
var fogColor;

var vec = new THREE.Vector3();
var dir = new THREE.Vector3();
var euler = new THREE.Euler(0, 0, 0, 'YXZ');
var ctx;
//var canvas_log = document.getElementById('log');




var Inspector = function() 
{
	this.position = "";
	this.distance = 400;
	this.inclination = 0.1; //0.49
	this.azimuth = 0.985; //0.205

	this.name = "untitled";
	this.URL = 'http://locus.creacast.com:9001/le-rove_niolon.mp3';
	//this.speed = 0.8;
	//this.displayOutline = false;
	this.color = [ 0, 128, 255 ]; // RGB array
	this.volume = 0.5;
	this.source = "sounds/banque/elements/eau.mp3";
	this.object = "cube";
	this.patch = "pd/adc_osc.pd";
	this.ir = "IR/1_tunnel_souterrain.wav";
	this.update = function() {
		alert("update");
	};
	this.destroyAll = function() {
		ActionDestroy();
	};

	this.createSource = function()
	{
		var url = this.source;
		ActionSound(url);
	};

	this.createObject = function()
	{
		var kind = this.object;
		ActionObject(kind);
	};

	this.createResonator = function()
	{
		var ir = this.ir;
		ActionResonator(ir);
	};
	this.createPatch = function()
	{
		var url = this.patch;
		ActionPatch(url);
	};

	this.loadPatch = function()
	{
		inputFile.click();
	};

	this.loadAudioFile = function()
	{
		inputFileAudio.click();
	};

	this.loadModelFile = function()
	{
		inputFileModel.click();
	};

	this.recorder = function() {
		alert("recorder");
	}; 

	this.stream = function() {
		alert("stream");
	}; 

	this.synthesis = function() {
		alert("synthesis");
	};
	
	this.cube = function() {
		ActionObject("cube");		
	};

	this.knot = function() {

		ActionObject("knot");
	};

	this.torus = function() {
		ActionObject("torus");
	};

	this.space1 = function() {
		alert("space1");
	};

	this.space2 = function() {
		alert("space2");
	};

	this.space3 = function() {
		alert("space3");
	};

	this.box1 = function() {
		ActionObject("box");
	};

	this.box2 = function() {
		ActionObject("box");
	};

	this.box3 = function() {
		ActionObject("box");
	};
  };
  
  parameters = new Inspector();


var logx = 0;
var logy = 10;
function Log(message) 
{
	if (logy>200-10)
	{
		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		logy = 10;
	}
	ctx.fillStyle = '#FFF';
	ctx.fillText(message, logx, logy );
	logy+=10;
}

function onWindowResize() {
	var height = window.innerHeight;
	camera.aspect = window.innerWidth / height;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, height);
}

/*
Pd.send('diam', [200]);
			//Pd.send('feedback', [0.99]);
			//Pd.send('freq', [440]);
			*/



/*$.get('pd/metro.pd', function(mainStr) {
// Loading the patch
patch = Pd.loadPatch(mainStr);
webPd.patchLoaded(mainStr);
})*/

if (PhysicsEnabled)
{
	physics = new CannonPhysics();
}

var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
renderer = new THREE.WebGLRenderer();
onWindowResize();
renderer.setClearColor(new THREE.Color(0x0088ff), 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
//renderer.shadowMap.type = THREE.BasicShadowMap;
document.body.appendChild(renderer.domElement);
renderer.domElement.ondrop = OnDrop;
renderer.domElement.ondragover = OnDragOver;



fogColor = new THREE.Color(0x001133);
//scene.background = fogColor;
//scene.fog = new THREE.Fog(fogColor, 0.0025, 20);
//scene.fog.density = 0;


//cells of 10ksqm
for (var x=-200;x<=200;x+=100)
{
	for (var z=-200;z<=200;z+=100)
	{
		AddGroundPlane(x,-10,z,95,95);
	}
}

camera.position.z = 0;
camera.position.y = 3;

camera.rotation.y = Math.PI/2;

//var light = new THREE.PointLight(0xffffff, 1, 100);
var light = new THREE.DirectionalLight( 0xffffff, 0.8 );
//var light = new THREE.DirectionalLight( 0xffffff, 1.0 );
//light = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI / 5, 0.3 );
light.position.set(10,30, 0);
light.castShadow = true;
light.shadow.camera.near = 0.01;
light.shadow.camera.far = 1000;
light.shadow.bias = 0.0001;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
scene.add(light);

var axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);

// Water
var waterGeometry = new THREE.PlaneBufferGeometry( 10000, 10000 );
water = new Water(
	waterGeometry,
	{
		textureWidth: 512,
		textureHeight: 512,
		waterNormals: new THREE.TextureLoader().load( 'textures/waternormals.jpg', function ( texture ) {
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		} ),
		alpha: 1.0,
		sunDirection: light.position.clone().normalize(),
		sunColor: 0xffffff,
		waterColor: 0x001e0f,
		distortionScale: 3.7,
		fog: scene.fog !== undefined
	}
);
water.rotation.x = - Math.PI / 2;
water.position.y = 0;
scene.add( water );
if (PhysicsEnabled)
	physics.addMesh( water);

// Skybox
var sky = new Sky();
var uniforms = sky.material.uniforms;
uniforms[ 'turbidity' ].value = 10;
uniforms[ 'rayleigh' ].value = 2;
uniforms[ 'luminance' ].value = 1;
uniforms[ 'mieCoefficient' ].value = 0.005;
uniforms[ 'mieDirectionalG' ].value = 0.8;
cubeCamera = new THREE.CubeCamera( 0.1, 1, 512 );
cubeCamera.renderTarget.texture.generateMipmaps = true;
cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipmapLinearFilter;
scene.background = cubeCamera.renderTarget;
function updateSun() {
	var theta = Math.PI * ( parameters.inclination - 0.5 );
	var phi = 2 * Math.PI * ( parameters.azimuth - 0.5 );
	light.position.x = parameters.distance * Math.cos( phi );
	light.position.y = parameters.distance * Math.sin( phi ) * Math.sin( theta );
	light.position.z = parameters.distance * Math.sin( phi ) * Math.cos( theta );
	sky.material.uniforms[ 'sunPosition' ].value = light.position.copy( light.position );
	water.material.uniforms[ 'sunDirection' ].value.copy( light.position ).normalize();
	cubeCamera.update( renderer, sky );
}
updateSun();

listener = new THREE.AudioListener();
camera.add(listener);
audioContext = listener.context;
//loaders
gltfLoader = new GLTFLoader();
//Flamingo.glb
//Parrot.glb
//Duck.glb
//Flower.glb

fontLoader = new THREE.FontLoader();
fontLoader.load( 'fonts/helvetiker_bold.typeface.json', function ( _font ) 
{
	font = _font;
});
  
window.addEventListener('resize', onWindowResize, false);

function Login()
{
	avatarname = document.getElementById('avatarname').value;
}

function AddGroundPlane(x,y,z,sizex, sizez)
{
	var geometryPlane = new THREE.PlaneBufferGeometry(sizex, sizez, 10, 10);
	var materialPlane = new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
	var plane = new THREE.Mesh(geometryPlane, materialPlane);
	//plane.setRotationFromEuler(0,0,0);
	plane.rotation.setFromVector3(new THREE.Vector3(-Math.PI / 2, 0, 0));
	plane.castShadow = false;
	plane.receiveShadow = true;
	plane.position.x = x;
	plane.position.y = y;
	plane.position.z = z;
	if (PhysicsEnabled)
		physics.addMesh( plane);
	scene.add(plane);
}

function animate() {
	
	stats.begin();
	var dt = 1/60;
	main_timer += dt;
	parameters.azimuth = parameters.azimuth+dt/360;
	if (parameters.azimuth > 1)
		parameters.azimuth -= 1;
	updateSun();

	water.material.uniforms[ 'time' ].value += dt;
	if (MovingForward === true) {
		moveCameraForward(avatar_speed);
		avatar_dirty = true;
	}
	if (MovingBackward === true) {
		moveCameraForward(-avatar_speed);
		avatar_dirty = true;
	}
	if (MovingLeft === true) {
		moveCameraRight(-avatar_speed);
		avatar_dirty = true;
	}
	if (MovingRight === true) {
		moveCameraRight(avatar_speed);
		avatar_dirty = true;
	}

	//underwater logic
	
	if (camera.position.y < 0)
	{
		water.rotation.x = + Math.PI / 2;
		/*scene.background = fogColor;
		if (scene.fog === undefined)
		{
			scene.fog = new THREE.Fog(fogColor, 1, 20);
		}*/
	}
	else
	{
		water.rotation.x = - Math.PI / 2;
		/*scene.background = cubeCamera.renderTarget;
		scene.fog = undefined;*/
	}
	
	parameters.position = ""+roundDown(camera.position.x, 2)+";"+roundDown(camera.position.y,2)+";"+roundDown(camera.position.z,2);
	//send avatar position to the server
	var send_interval = 0.05;
	if (avatarname !== "" && avatar_dirty && main_timer > 3)
	{
		
		send_timer += 1/60;
		if (send_timer > send_interval)
		{
			avatar_dirty = false;
			send_timer -= send_interval;

			var obj = {};
			obj.id = avatarname;
			obj.kind = "avatar";
			obj.name = avatarname;
			obj.x = camera.position.x;
			obj.y = camera.position.y;
			obj.z = camera.position.z;
			obj.rotation = {};
			obj.rotation.x = camera.rotation.x;
			obj.rotation.y = camera.rotation.y;
			obj.rotation.z = camera.rotation.z;
			obj.r = Math.random();
			obj.g = Math.random();
			obj.b = Math.random();
			obj.scale = {};
			obj.scale.x = 1;
			obj.scale.y = 1;
			obj.scale.z = 1;
			//parameters.position = ""+roundDown(obj.x, 2)+";"+roundDown(obj.y,2)+";"+roundDown(obj.z,2);
			firebase.database().ref('spaces/test/objects/' + avatarname).set(obj);
		}
	}

	//apply reverb?

	for (var j in space_objects)
	{
		var r = space_objects[j];
		if (r.remote.kind === "resonator")
		{
			var bb = new THREE.Box3();
			r.object3D.geometry.computeBoundingBox();
			bb.copy( r.object3D.geometry.boundingBox ).applyMatrix4( r.object3D.matrixWorld );
			//console.log("test BB", bb);
			for (var i in space_objects)
			{
				var o = space_objects[i];
				if (o.object3D.audio !== undefined && o.object3D.convolver === undefined )
				{
					//check if sound inside box
					
					var isInside = bb.containsPoint(o.object3D.position);
					
					if (isInside)
					{
						//console.log("INSIDE! connect ", o.object3D.audio.gain, r.object3D.convolver);
						if (r.object3D.convolver !== undefined)
						{
							if (o.object3D.audio.gain != undefined)
							{
								o.object3D.audio.gain.disconnect();
								o.object3D.audio.gain.connect( r.object3D.convolver);
								o.object3D.material.emissive.set( 0x77777777 );


							}
						}
					}	
					else
					{
						//console.log("OUTSIDE!");
						if (o.object3D.audio.gain != undefined)
						{
							o.object3D.audio.gain.disconnect();
							o.object3D.audio.gain.connect(o.object3D.audio.listener.getInput());
							o.object3D.material.emissive.set( 0x00000000 );
						}
						
					
					}
				}
			}
		}
	}


			
			/*
			var box = <Your non-aligned box>
var point = <Your point>

box.geometry.computeBoundingBox(); // This is only necessary if not allready computed
box.updateMatrixWorld(true); // This might be necessary if box is moved
var boxMatrixInverse = new THREE.Matrix4().getInverse(box.matrixWorld);
var inverseBox = box.clone();
var inversePoint = point.clone();
inverseBox.applyMatrix(boxMatrixInverse);
inversePoint.applyMatrix4(boxMatrixInverse);
var bb = new THREE.Box3().setFromObject(inverseBox);
var isInside = bb.containsPoint(inversePoint);
*/

		
		//console.log("update " + o.object3D);

	


	renderer.render(scene, camera);

	stats.end();
	requestAnimationFrame(animate);
}

animate();


function roundDown(number, decimals) {
    decimals = decimals || 0;
    return ( Math.floor( number * Math.pow(10, decimals) ) / Math.pow(10, decimals) );
}

//creates a new atlantis object (on database demand)
function createObject(o) 
{
	var cube;
	
	
		Log("create object "+ o.kind);
		//console.log("create object "+ o.kind);
		var geometry;
		if (o.kind === "cube")
		{
			geometry = new THREE.BoxBufferGeometry();
		}
		else if (o.kind === "box")
		{
			geometry = new THREE.BoxBufferGeometry();
		}
		else if (o.kind === "sphere")
		{
			geometry = new THREE.SphereBufferGeometry(1,20,20);
		}
		else if (o.kind === "avatar")
		{
			geometry = new THREE.DodecahedronGeometry();
		}
		else if (o.kind === "stream")
		{
			geometry = new THREE.TorusGeometry( 0.5, 0.2, 8, 30 );
		}
		else if (o.kind === "torus")
		{
			geometry = new THREE.TorusGeometry( 0.5, 0.2, 8, 30 );
		}
		else if (o.kind === "knot")
		{
			geometry = new THREE.TorusKnotGeometry( 0.5, 0.2, 60, 8 );
		}
		else if (o.kind === "cylinder")
		{
			geometry = new THREE.CylinderGeometry( 1, 1, 2, 16 );
		}
		else if (o.kind === "cone")
		{
			geometry = new THREE.ConeGeometry( 1, 2, 16);
		}
		else if (o.kind === "resonator")
		{
			geometry = new THREE.BoxBufferGeometry(10,6,8);
		}
		else if (o.kind === "island")
		{	
			geometry = new THREE.CylinderGeometry( 40, 50, 2, 64 );
		}
		else 
		{
			geometry = new THREE.SphereBufferGeometry(1,20,20);
		}
		
		var material = null;
		
		if (o.kind === "box" || o.kind === "resonator")
		{
			material = new THREE.MeshStandardMaterial({transparent:true,opacity:0.5, roughness:0.0});
		}
		else
		{
			material = new THREE.MeshStandardMaterial();
		}
		
		cube = new THREE.Mesh(geometry, material);
		cube.position.x = o.x;
		cube.position.y = o.y;
		cube.position.z = o.z;

		cube.rotation.x = o.rotation.x;
		cube.rotation.y = o.rotation.y;
		cube.rotation.z = o.rotation.z;

		if (o.scale !== undefined)
		{
			cube.scale.x = o.scale.x;
			cube.scale.y = o.scale.y;
			cube.scale.z = o.scale.z;
		}

		material.color.r = o.r;
		material.color.g = o.g;
		material.color.b = o.b;

		if (o.kind !== "box" && o.kind !== "resonator")
		{
			cube.castShadow = true;
			cube.receiveShadow = false;
		}
		
		//material.color.setHex(Math.random() * 0xffffff );
		scene.add(cube);

		var display_text = "";
		//texte
		//if (o.kind === "avatar")// || o.kind === "stream" || o.kind === "sound")
		{
			if (o.name !== undefined)
			{
				display_text = o.name;
			}
		}
		if (display_text !== "")
		{
				var geometryText = new THREE.TextGeometry( display_text, {
					font: font,
					size: 20,
					height: 0.5,
					curveSegments: 2,
					bevelEnabled: true,
					bevelThickness: 1,
					bevelSize: 0,
					bevelOffset: 0,
					bevelSegments: 5
				} );

				var materialText = new THREE.MeshPhongMaterial();
				var text = new THREE.Mesh(geometryText, materialText);
				cube.add(text);
				text.scale.set(0.01,0.01,0.01);
				text.position.y = 1.2;
				text.rotation.y = Math.PI;
				//console.log("text", text);
		}

		if (o.kind === "avatar")
		{
			//avatar flashlight
			//HERE
			//var avatarlight = new THREE.SpotLight( 0xffccaa, 1, 0, Math.PI / 10, 0 );
			/*var avatarlight = new THREE.PointLight(0xffccaa, 1, 10);
			cube.add(avatarlight);
			avatarlight.position.set(0,0, 0);
			avatarlight.rotation.set(0,0, 0);
			avatarlight.castShadow = true;
			*/
		}
		else if (o.pd !== undefined)
		{
			var sound = new THREE.PositionalAudio( listener );
			try
			{
				Log("read pd patch...");
				console.log("read pd patch:", o.pd);
				patch = Pd.loadPatch(o.pd);
				//Pd.start();
				//console.log("loaded patch:", patch);
				var out = patch.o(0);
				//console.log("out:", out);
				var outnode = patch.o(0).getOutNode();
				//console.log("out node", outnode);
				//patch.o(0).setWaa(Pd.getAudio().context.createGain(), 0);
				if (outnode !== undefined)
				{
					sound.setNodeSource(patch.o(0).getOutNode());
				}
			}
			catch (exception)
			{
				Log("PD patch loading exception:" + exception);
				console.log("PD patch loading exception:", exception);
			}
			sound.setRefDistance( 1 );
			sound.setRolloffFactor(1);
			sound.setDistanceModel("exponential");
			sound.play();
			cube.add(sound);
			cube.audio = sound;
			Pd.receive('tick', function(args) 
			{
				//console.log('received a message from "tick" : ', args, cube);
				//" color.setHex( Math.random() * 0xffffff );
				//selection.object3D.material.color.setHex(Math.random() * 0xffffff );
				cube.material.color.setHex(Math.random() * 0xffffff );
				//o.r = Math.random();
				//o.g = Math.random();
				//o.b = Math.random();
				//console.log("sending");
				//firebase.database().ref('spaces/test/objects/' + o.id).set(o.remote);
			});

			Pd.receive('metroTime', function(args) 
			{
				//console.log("metroTime:", args)
				//cube.scale.z = args[0]/100;
			});
			

			Pd.receive('FmCarrier', function(args) 
			{
				//console.log("FmCarrier:", args)
				//cube.scale.y = args[0]/100;
				//cube.material.color.g = args[0]/100;
			});

			Pd.receive('FmMod', function(args) 
			{
				//console.log("FmMod:", args)
				//cube.scale.x = args[0];

			});
			
			

			
			
			
		}
		else
		{
			// create the PositionalAudio object (passing in the listener)
			var sound = new THREE.PositionalAudio( listener );
			// load a sound and set it as the PositionalAudio object's buffer
			var audioLoader = new THREE.AudioLoader();
			if (o.kind === "cube")
			{
				/*audioLoader.load( 'sounds/rec_2018_10_21_10_24_32.wav', function( buffer ) {
					sound.setBuffer( buffer );
					sound.setRefDistance( 0.5 );
					sound.setRolloffFactor(2);
					sound.setDistanceModel("exponential");
					//panner.panningModel = 'HRTF';
					//panner.distanceModel = 'inverse';
					sound.offset = Math.random()*3;
					sound.play();
					
					sound.setLoop( true );
				});
				*/
			}
			else if (o.kind === "stream")
			{
				var mediaElement = new Audio("http://locus.creacast.com:9001/le-rove_niolon.mp3");
				mediaElement.crossOrigin = "anonymous";
				mediaElement.loop = true;
				mediaElement.play();
				sound.setMediaElementSource( mediaElement );
				//sound.play(); //no play possible (have to play the Audio directly)
			}
			else if (o.kind === "eau")
			{
				var mediaElement = new Audio("sounds/banque/elements/eau.mp3");
				mediaElement.crossOrigin = "anonymous";
				mediaElement.loop = true;
				mediaElement.play();
				sound.setMediaElementSource( mediaElement );
			}
			else if (o.kind === "sound")
			{
				var audioLoader = new THREE.AudioLoader();
				audioLoader.load( o.url, function( buffer ) {
					console.log("LOADED!", buffer);
					Log("loaded sound " + o.url);
				sound.setBuffer( buffer );
				sound.setLoop( true );
				sound.setVolume( 0.5 );
				sound.play();
				});
				//var mediaElement = new Audio(o.url);
				//mediaElement.crossOrigin = "anonymous";
				//mediaElement.loop = true;
				//mediaElement.play();
				//sound.setMediaElementSource( mediaElement );
				sound.setRefDistance( 1 );
				sound.setRolloffFactor(1.2);
				sound.setDistanceModel("exponential");
				
				/*
				//test IR
				var convolver = audioContext.createConvolver();
				var irRRequest = new XMLHttpRequest();
				irRRequest.open("GET", "IR/1_tunnel_souterrain.wav", true);
				irRRequest.responseType = "arraybuffer";
				irRRequest.onload = function() {
					audioContext.decodeAudioData( irRRequest.response, 
						function(buffer) { convolver.buffer = buffer; } );
				}
				irRRequest.send();
				// note the above is async; when the buffer is loaded, it will take effect, but in the meantime, the sound will be unaffected.
				sound.gain.connect( convolver);
				convolver.connect( sound.listener.getInput() );
				*/
				
			}	

			else if (o.kind === "resonator")
			{
				cube.convolver = audioContext.createConvolver();
				var audioLoader = new THREE.AudioLoader();
				audioLoader.load( o.ir, function( buffer ) {
					console.log("LOADED!", buffer);
					Log("loaded IR " + o.ir);
					cube.convolver.buffer = buffer;
				});
				sound.setRefDistance( 1 );
				sound.setRolloffFactor(0);
				sound.setDistanceModel("linear");
				//sound.gain.connect( o.convolver);
				cube.convolver.connect( sound.listener.getInput() );
			}	
			else if (o.kind === "duck")
			{
				material.visible = false;
				gltfLoader.load( 'models/Duck.glb', function ( gltf ) 
				{
					//gltf.scene.scale.set(0.01,0.01,0.01);
					cube.add( gltf.scene);
				}, undefined, function ( error ) {
					console.error( error );
				} );
			}
			else if (o.kind === "model")
			{
				material.visible = false;
				gltfLoader.load( o.url, function ( gltf ) 
				{
					//gltf.scene.scale.set(0.01,0.01,0.01);
					cube.add( gltf.scene);
				}, undefined, function ( error ) {
					console.error( error );
				} );
			}


			cube.add(sound);
			cube.audio = sound;
		}
		//console.log("physics add mesh");
		if (PhysicsEnabled)
			physics.addMesh( cube, 1);
		//var position = new THREE.Vector3();
		//position.set( 0, Math.random() * 2, 0 );
		//physics.setMeshPosition( cube, position );
		return cube;
}



function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	  var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
	  return v.toString(16);
	});
  }



  function openFileModel(event) {
	var input = event.target;
	var file = input.files[0];
	var storage = firebase.storage();
	var storageRef = storage.ref(); // Create a storage reference from our storage service
	var audioRef = storageRef.child('models');
	var fileRef = audioRef.child(uuidv4());

	var url = fileRef.fullPath;
	Log("uploading to " + url);
	fileRef.put(file).then(function(snapshot) 
	{
		console.log('Uploaded a blob or file! ');			
		var obj= getNewObjectCommand("model");
		fileRef.getDownloadURL().then(function(url) {
			obj.url = url;
			obj.name = "model";
			firebase.database().ref('spaces/test/objects/' + obj.id).set(obj);
		}).catch(function(error) {
			// Handle any errors
		  });
		  
		
	});
	
	
}

function openFileAudio(event) {
	var file = event.target.files[0];
	uploadAudioFile(file);
}


function openFile(event) {
	var input = event.target;
	var reader = new FileReader();
	reader.onload = function () 
	{
		var text = reader.result;
		var node = document.getElementById('output');
		//node.innerText = text;
		console.log(reader.result.substring(0, 200));
		/*if (patch !== undefined) 
		{
			Pd.destroyPatch(patch);
		}
		*/
		//send a patch instruction to firebase
		//patch = Pd.loadPatch(text);
		//console.log("loaded patch:", patch);
		var obj= getNewObjectCommand("cube");
		obj.pd = text;
		obj.name = "PD patch";
		firebase.database().ref('spaces/test/objects/' + obj.id).set(obj);
	};
	reader.readAsText(input.files[0]);
}


function uploadAudioFile(file, worldposition)
{
	
	var storage = firebase.storage();
	var storageRef = storage.ref(); // Create a storage reference from our storage service
	var audioRef = storageRef.child('audiofiles');
	var fileRef = audioRef.child(uuidv4());

	var url = fileRef.fullPath;
	Log("uploading to " + url);
	fileRef.put(file).then(function(snapshot) 
	{
		console.log('Uploaded a blob or file! ');			
		var obj= getNewObjectCommand("sound");
		if (worldposition !== undefined)
		{
			obj.x = worldposition.x;
			obj.y = worldposition.y;
			obj.z = worldposition.z;
		}
		fileRef.getDownloadURL().then(function(url) {
			obj.url = url;
			obj.name = "audio file";
			firebase.database().ref('spaces/test/objects/' + obj.id).set(obj);
		}).catch(function(error) {
			// Handle any errors
		  });
		  
		
	});
}

function moveCameraForward(distance) {

	// move forward parallel to the xz-plane
	// assumes camera.up is y-up
	//vec.setFromMatrixColumn( camera.matrix, 0 );
	//vec.crossVectors( camera.up, vec );
	//camera.position.addScaledVector( vec, distance );

	camera.getWorldDirection(dir);
	camera.position.x += (dir.x * distance);
	camera.position.y += (dir.y * distance);
	camera.position.z += (dir.z * distance);

	if (object_selection !== undefined)
	{
		object_selection.position.x += (dir.x * distance);
		object_selection.position.y += (dir.y * distance);
		object_selection.position.z += (dir.z * distance);
		UpdateSelection();
	}

	
		
}

function UpdateSelection()
{
	if (selection !== undefined)
	{
		selection.remote.x = object_selection.position.x;
		selection.remote.y = object_selection.position.y;
		selection.remote.z = object_selection.position.z;
		//console.log("update selection", selection);
		firebase.database().ref('spaces/test/objects/' + selection.remote.id).set(selection.remote);
	}
}


function moveCameraRight(distance) {

	vec.setFromMatrixColumn(camera.matrix, 0);
	camera.position.addScaledVector(vec, distance);

	if (object_selection !== undefined)
	{
		object_selection.position.addScaledVector(vec, distance);
		UpdateSelection();
	}
}


function onMouseMove(event) {

	if (MouseDrag)
	{
		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
		euler.setFromQuaternion(camera.quaternion);
		euler.y -= movementX * 0.003;
		euler.x -= movementY * 0.003;
		euler.x = Math.max(- 3.14 / 2, Math.min(3.14 / 2, euler.x));
		camera.quaternion.setFromEuler(euler);
		avatar_dirty = true;
	}
	if (ObjectDrag)
	{
		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
		vec.setFromMatrixColumn(camera.matrix, 0);
		object_selection.position.addScaledVector(vec, movementX*0.02);
		//camera.getWorldUp(dir);
		object_selection.position.addScaledVector(camera.up, movementY*-0.02);
		if (PhysicsEnabled)
			physics.setMeshPosition( object_selection, object_selection.position );
		UpdateSelection();
	}
}


function handleStart(event)
{
	//console.log(event);

}

function handleEnd()
{

}

function handleCancel()
{

}

function handleLeave()
{

}

function handleMove()
{

}


function getNewObjectCommand(kind)
{
	camera.getWorldDirection(dir);
	//FIXME : unique ID
	var obj_id = Math.floor(Math.random() * 100000);
	console.log("obj_id=" + obj_id);
	var obj = {};
	obj.kind = kind;
	obj.id = obj_id;
	var spawn_distance = 3;
	obj.x = camera.position.x + dir.x * spawn_distance;
	obj.y = camera.position.y + dir.y * spawn_distance;
	obj.z = camera.position.z + dir.z * spawn_distance;
	obj.rotation = {};
	obj.rotation.x = camera.rotation.x;
	obj.rotation.y = camera.rotation.y;
	obj.rotation.z = camera.rotation.z;
	obj.r = Math.random();
	obj.g = Math.random();
	obj.b = Math.random();

	//FIXME
	obj.scale = {};
	if (kind === "box" || kind === "resonator")
	{
		//obj.scale.x = 10;
		//obj.scale.y = 6;
		//obj.scale.z = 8;
		obj.rotation.x = 0;
		obj.rotation.y = 0;
		obj.rotation.z = 0;

	}
	if (kind === "island")
	{
		obj.y = 0;
		obj.rotation.x = 0;
		obj.rotation.y = 0;
		obj.rotation.z = 0;
		obj.r = 1;
		obj.g = 1;
		obj.b = 0.7;

	}
	else
	{
		obj.scale.x = 1;
		obj.scale.y = 1;
		obj.scale.z = 1;
	}
	return obj;
}

var startButton = document.getElementById( 'startButton' );
startButton.onclick = StartDSP;
var inputFile = document.createElement("input");
inputFile.type = "file";
inputFile.id = 'pd';
inputFile.onchange = openFile;

var inputFileAudio = document.createElement("input");
inputFileAudio.type = "file";
inputFileAudio.id = 'wav';
inputFileAudio.onchange = openFileAudio;

var inputFileModel = document.createElement("input");
inputFileModel.type = "file";
inputFileModel.id = '3d';
inputFileModel.onchange = openFileModel;




function StartDSP()
{
	//log canvas
	ctx = document.createElement('canvas').getContext('2d');
	document.getElementById('info').appendChild(ctx.canvas);
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = 200;
	ctx.fillStyle = '#000';
	ctx.strokeStyle = '#FFF';
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	Log("Welcome to New Atlantis...");
	Login();
	//overlay
	var overlay = document.getElementById( 'overlay' );
	overlay.remove();

	CreateGUI();

	var options = {};
	options.audioContext = audioContext;
	Pd.start(options);

	// Initialize Firebase
	
	firebase.initializeApp(firebaseConfig);
	firebase.auth().signInAnonymously().catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// ...
	  });
	firebase.analytics();
	//console.log("firebase", firebase);
	var val = Math.random();


	document.addEventListener("touchstart", handleStart, false);
	document.addEventListener("touchend", handleEnd, false);
	document.addEventListener("touchcancel", handleCancel, false);
	document.addEventListener("touchleave", handleLeave, false);
	document.addEventListener("touchmove", handleMove, false);
	document.addEventListener('mousemove', onMouseMove, false);
	document.addEventListener('mousedown', (event) => {
		//picking
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		raycaster.setFromCamera( mouse, camera );

		var intersections = raycaster.intersectObjects( objects, true );
		//console.log("intersection=" , intersections);
		if ( intersections.length > 0 ) 
		{
			ObjectDrag = true;
			object_selection = intersections[ 0 ].object;
			
			selection = objects_main[object_selection.uuid];

			if (selection.remote.kind === "island")
			{
				//non draggable
				object_selection = undefined;
				selection = undefined;
				ObjectDrag = false;
				MouseDrag = true;
			}
			else
			{
				object_selection.material.emissive.set( 0xaaaaaaaa );
			}
			//console.log("selection set to:", selection);
			/*
			if ( group.children.includes( object ) === true ) {
				object.material.emissive.set( 0x000000 );
				scene.attach( object );
			} else {
				object.material.emissive.set( 0xaaaaaa );
				group.attach( object );
			}
			controls.transformGroup = true;
			draggableObjects.push( group );
			*/
		}
		else
		{
			if (object_selection !== undefined)
			{
				object_selection.material.emissive.set( 0x00000000 );
				object_selection = undefined;
			}
			MouseDrag = true;
		}
		/*
		if ( group.children.length === 0 ) {
			controls.transformGroup = false;
			draggableObjects.push( ...objects );
		}
		*/
		





	}, false);

	document.addEventListener('mouseup', (event) => {
		MouseDrag = false;
		ObjectDrag = false;
		if (object_selection !== undefined)
		{
			object_selection.material.emissive.set( 0x00000000 );
			object_selection = undefined;
		}
	}, false);


	document.addEventListener('keyup', (event) => {
		const nomTouche = event.key;
		//console.log("release:"+nomTouche);


		switch (event.keyCode) {
			case 38: // up
				MovingForward = false;
				break;
			case 37: // left
				MovingLeft = false;
				break;
			case 40: // down
				MovingBackward = false;
				break;
			case 39: // right
				MovingRight = false;
				break;
			case 16: //shift
				avatar_speed = 0.1;
			break;
		}
	}, false);

	document.addEventListener('keydown', (event) => {
		const nomTouche = event.key;
		//console.log("pressed:" + nomTouche);
		
		switch (event.keyCode) {
			case 38: // up
				MovingForward = true;
				break;
			case 37: // left
				MovingLeft = true;
				break;
			case 40: // down
				MovingBackward = true;
				break;
			case 39: // right
				MovingRight = true;
				break;
			case 8: //backspace
				DeleteCurrentSelection();
			break;
			case 13: //enter
			//SendMessageToCurrentSelection();
			parameters.createObject();
			break;
			case 16: //shift
				avatar_speed = 0.5;
			break;
		}

		
		if (nomTouche === 'p') 
		{
			selection.remote.y += 0.1;
			firebase.database().ref('spaces/test/objects/' + selection.remote.id).set(selection.remote);
		}
		if (nomTouche === 'm') 
		{

			selection.remote.y -= 0.1;
			firebase.database().ref('spaces/test/objects/' + selection.remote.id).set(selection.remote);
		}
	}, false);


var objectsRef = firebase.database().ref('spaces/test/objects');
objectsRef.on('child_changed', function (snapshot) {
	var object = snapshot.val();
	//console.log("changed", object);
	var selectedObject = space_objects[object.id];//scene.getObjectByName(object.id);
	selectedObject.remote = object;
	selectedObject.object3D.position.x = object.x;
	selectedObject.object3D.position.y = object.y;
	selectedObject.object3D.position.z = object.z;
	selectedObject.object3D.rotation.x = object.rotation.x;
	selectedObject.object3D.rotation.y = object.rotation.y;
	selectedObject.object3D.rotation.z = object.rotation.z;
	selectedObject.object3D.material.color.r = object.r;
	selectedObject.object3D.material.color.g = object.g;
	selectedObject.object3D.material.color.b = object.b;

});

objectsRef.on('child_added', function (snapshot) {
	var object = snapshot.val();
	//console.log("added", object);

	var newobj = {};
	newobj.remote = object;
	newobj.object3D = createObject(object);
	objects.push(newobj.object3D);
	objects_main[newobj.object3D.uuid] = newobj;
	//selection = newobj;
	space_objects[object.id] = newobj;
	if (object.id === avatarname)
	{
		//this avatar, we update camera
		camera.position.x = object.x;
		camera.position.y = object.y;
		camera.position.z = object.z;
		camera.rotation.x = object.rotation.x;
		camera.rotation.y = object.rotation.y;
		camera.rotation.z = object.rotation.z;
	}
});

objectsRef.on('child_removed', function (snapshot) {
	var object = snapshot.val();
	//console.log("removed", object);
	var selectedObject = space_objects[object.id];//scene.getObjectByName(object.id);
	//console.log("removing", selectedObject);
	scene.remove(selectedObject.object3D);
	const index = objects.indexOf(selectedObject.object3D);
	if (index > -1) 
	{
		objects.splice(index, 1);
	}

	//selectedObject.object3D.dispose();
	if (selectedObject.object3D.audio !== undefined)
	{
		selectedObject.object3D.audio.stop();
		selectedObject.object3D.audio.gain.disconnect();
		selectedObject.object3D.audio.source.disconnect();
		selectedObject.object3D.audio.panner.disconnect();

		selectedObject.object3D.audio.gain = null;
		selectedObject.object3D.audio.source = null;
		selectedObject.object3D.audio.panner = null;
	}
	//FIXME : delete ?

	
});

objectsRef.on('value', function (snapshot) {
	var object = snapshot.val();
	//console.log("value", object);
	//space_objects.remove(object.id)
});







}

function StopDSP()
{
	Pd.stop();
}


function ActionCube()
{
	var obj= getNewObjectCommand("cube");
	firebase.database().ref('spaces/test/objects/' + obj.id).set(obj);
}

function ActionDestroy()
{
	
	firebase.database().ref('spaces/test/objects').set([]);
}

function ActionPatch(url)
{
	var req = new XMLHttpRequest();
	req.open("GET", url, true);
	
	req.onload = function() {
		var obj= getNewObjectCommand("cube");
		obj.pd = req.response;
		obj.name = url;
		firebase.database().ref('spaces/test/objects/' + obj.id).set(obj);	
	}
	req.send();
	
}

function ActionStream()
{

	var obj= getNewObjectCommand("stream");

	firebase.database().ref('spaces/test/objects/' + obj.id).set(obj);
}

function ActionKnot()
{

	var obj= getNewObjectCommand("knot");
	firebase.database().ref('spaces/test/objects/' + obj.id).set(obj);
}

function ActionObject(kind)
{

	var obj= getNewObjectCommand(kind);
	obj.name = kind;
	firebase.database().ref('spaces/test/objects/' + obj.id).set(obj);
}


function ActionEau()
{

	var obj= getNewObjectCommand("eau");

	firebase.database().ref('spaces/test/objects/' + obj.id).set(obj);
}

function ActionSound(url)
{

	var obj= getNewObjectCommand("sound");
	obj.name = "sound";
	obj.url = url;
	firebase.database().ref('spaces/test/objects/' + obj.id).set(obj);
}

function ActionResonator(ir)
{
	var obj= getNewObjectCommand("resonator");
	obj.name = ir;
	obj.ir = ir;
	firebase.database().ref('spaces/test/objects/' + obj.id).set(obj);
}

/*function ActionPatch(url)
{

	var obj= getNewObjectCommand("sound");
	obj.name = "sound";
	obj.url = url;
	firebase.database().ref('spaces/test/objects/' + obj.id).set(obj);
}*/

function DeleteCurrentSelection()
{
	Log("delete object " + selection.remote.name + "(" + selection.remote.kind + ")");
	firebase.database().ref('spaces/test/objects/' + selection.remote.id).remove();
	selection = undefined;
	object_selection = undefined;
	ObjectDrag = false;

}

function SendMessageToCurrentSelection()
{
	Pd.send('diam', [200]);
}





function CreateGUI()
{
	dat.GUI.TEXT_CLOSED = "New Atlantis - Close controls";
	dat.GUI.TEXT_OPEN = "New Atlantis - Open controls";
	
	gui = new dat.GUI();
	var fAudioSources = gui.addFolder('Audio Source');
	var f3D = gui.addFolder('3D Object');
	var fBox = gui.addFolder('Box (modifier) (not impl.)');
	var fSpace = gui.addFolder('Space (resonator)');



	var folder = gui.addFolder( 'Sky' );
	folder.add( parameters, 'inclination', 0, 0.5, 0.0001 ).onChange( updateSun );
	folder.add( parameters, 'azimuth', 0, 1, 0.0001 ).onChange( updateSun ).listen();
	
	fAudioSources.add(parameters, "source", na_library_sound);
	fAudioSources.add(parameters, "createSource");
	fAudioSources.add(parameters, "loadAudioFile");
	fAudioSources.add(parameters, "patch", na_library_patches);
	fAudioSources.add(parameters, "createPatch");
	fAudioSources.add(parameters, "loadPatch");


	fBox.add(parameters, "box1");
	fBox.add(parameters, "box2");
	fBox.add(parameters, "box3");

	fSpace.add(parameters, "ir", na_library_ir);
	fSpace.add(parameters, "createResonator");
	
	
	f3D.add(parameters, "object", na_library_objects);
	f3D.add(parameters, "createObject");
	f3D.add(parameters, "loadModelFile");

	gui.add(parameters, 'destroyAll');
	gui.add(parameters, 'position').listen();
	
	//gui.add(obj, 'volume', 0, 1);

/*
	var gui2 = new dat.GUI();	
	var f1 = gui2.addFolder('folder1');
	var f2 = gui2.addFolder('folder2');
	var f3 = gui2.addFolder('folder3');
*/

	/*
	Audio Source
Box (modifieurs)
Space (resonnateurs)
Hammer (pour casser les Sound Objects – piste pour la granulation)
Handle (pour déformer les objets)
Ground
Sky (à voir si c’est nécessaire, pourrait permettre de choisir différent ground ou différent sky)

*/

	//gui.remove(obj, "destroy");
	//gui.add(obj, 'destroy');
	//gui.width = 400;

	parameters.name = "name";
	parameters.volume = 0.7;

	// Iterate over all controllers
	for (var i in gui.__controllers) {
		gui.__controllers[i].updateDisplay();
	}

	gui.close();
}

function OnDrop(ev)
{
	ev.preventDefault();
	console.log("ondrop", ev);
	if (ev.dataTransfer.items) 
	{
		// Use DataTransferItemList interface to access the file(s)
		for (var i = 0; i < ev.dataTransfer.items.length; i++) 
		{
		  // If dropped items aren't files, reject them
		  if (ev.dataTransfer.items[i].kind === 'file') 
		  {
			var file = ev.dataTransfer.items[i].getAsFile();


			//picking
			mouse.x = ( ev.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( ev.clientY / window.innerHeight ) * 2 + 1;
			raycaster.setFromCamera( mouse, camera );

			var intersections = raycaster.intersectObjects( objects, true );
			//console.log("intersection=" , intersections);
			var spawn_position = new THREE.Vector3();
			if ( intersections.length > 0 ) 
			{
				spawn_position = intersections[ 0 ].point;
				
			}
			else
			{
				spawn_position = raycaster.ray.origin.clone();
				spawn_position.addScaledVector(raycaster.ray.direction, 10);
				
			}
			//according to the extension...
			uploadAudioFile(file, spawn_position);

			
			
		  }
		}
	  } 
	  else 
	  {
		// Use DataTransfer interface to access the file(s)
		for (var i = 0; i < ev.dataTransfer.files.length; i++) {
		  console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
		}
	  }




}

function OnDragOver(ev)
{

	ev.preventDefault();
    return false;
}