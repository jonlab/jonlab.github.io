import { GLTFLoader } from './examples/jsm/loaders/GLTFLoader.js';
import { Water } from './examples/jsm/objects/Water.js';
import { Sky } from './examples/jsm/objects/Sky.js';
import Stats from './examples/jsm/libs/stats.module.js';
import { CannonPhysics } from './examples/jsm/physics/CannonPhysics.js';
import { TransformControls } from './examples/jsm/controls/TransformControls.js';
import { VRButton } from './examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from './examples/jsm/webxr/XRControllerModelFactory.js';

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
var control;
var spawn_distance = 3;
var logx = 0;
var logy = 10;
var log_dirty = false;

var minimap_dirty = false;
var network_activity = 0;
var network_bytes = 0;

var frame = 0;
var midi = null;  // global MIDIAccess object

//freesound API
var baseurl_freesoundsearch = "https://freesound.org/apiv2/search/text/?token=IcsqGmC1CiYHNtyWpZ4ETJFHb8OM5QhzZYb3AzGj&fields=previews,description,name&query=";
var controller_freesound;
var controller_createfreesound;

var scene; //Three js 3D scene
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var cursor;
var selfie;
var physics;

var avatarname = "";
var main_timer = 0;
var send_timer = 0;
var avatar_dirty = false;
var avatar_speed = 5;

var space_objects = [];  //overall objects
var objects = []; //THREE objects
var objects_main = [];
var avatars = []; //all avatars
var water;
var sky;
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
var parameters; //backpack
var inputFile;
var fogColor;

var audioRecorder;
var vec = new THREE.Vector3();
var dir = new THREE.Vector3();
var euler = new THREE.Euler(0, 0, 0, 'YXZ');

var ctx;
var logs = [];
var chat_input;
var chat_button;

var ctx_minimap;

var run_button;
var stop_script_button;
var listener_filter;

var loading_threshold = 500;

var spawning_point="";

var audio_notification = new Audio("sounds/poc.wav");
audio_notification.loop = false;
//VR
var mode = "";
var controller1, controller2;
var controllerGrip1, controllerGrip2;



//URL parameters parsing
const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);
if (urlParams !== undefined)
{
	spawning_point = urlParams.get('spawn')
	console.log("spawning_point=" + spawning_point);
	mode = urlParams.get('mode')
}





var Inspector = function() 
{
	this.editMode = false;
	this.advancedMode = true;
	this.position = "";
	this.poi = '{"x":0,"y":1,"z":0}';
	this.distance = 400;
	this.inclination = 0.1; //0.49
	this.azimuth = 0.99; //0.205
	this.timeEnabled = true;
	this.name = "untitled";
	this.URL = 'http://locus.creacast.com:9001/le-rove_niolon.mp3';
	this.search = "seagull";
	this.color = [ 0, 128, 255 ]; // RGB array
	this.volume = 0.5;
	this.source = "sounds/banque/elements/eau.mp3";
	this.object = "cube";
	this.patch = "pd/adc_osc.pd";
	this.ir = "IR/1_tunnel_souterrain.wav";
	this.fx = "biquad_lowpass";

	this.freesound = "";


	this.update = function() {
		alert("update");
	};
	this.destroyAll = function() {
		ActionDestroy();
	};
	this.startTutorial = function()
	{
		Log("use the arrows to move around...", 0);
		Log("click and drag to look around...", 0);
		Log("...tutorial in progress...", 0);
	};
	this.createSource = function()
	{
		var url = this.source;
		ActionSound(url);
	};

	this.startRecording = function()
	{
		audioRecorder.startRecording();
		Log("recording started...", 3);
	};

	this.stopRecording = function()
	{
		audioRecorder.finishRecording();
		Log("recording stopped...", 2);
	};

	this.createFreesound = function()
	{
		var url = this.freesound;
		ActionSound(url);
	};

	this.createObject = function()
	{
		var kind = this.object;
		var name = this.name;
		ActionObject(kind, name);
	};

	this.createResonator = function()
	{
		var ir = this.ir;
		ActionResonator(ir);
	};

	this.createBox = function()
	{
		var fx = this.fx;
		ActionBox(fx);
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

	this.searchFreesound = function()
	{
		var url = baseurl_freesoundsearch + this.search;
		var req = new XMLHttpRequest();
		req.open("GET", url, true);
		req.onload = function() 
		{
			var result = JSON.parse(req.response);
			//console.log("freesound returned:", result);
			//construct the results UI
			var freesound_list = {};
			for (var i in result.results)
			{
				var entry = result.results[i];
				freesound_list[entry.name] = entry.previews['preview-hq-mp3'];
				
			}
			if (controller_freesound !== undefined)
				controller_freesound.remove();
			if (controller_createfreesound !== undefined)
			controller_createfreesound.remove();
			controller_freesound = fAudioSourcesFreeSound.add(parameters, "freesound", freesound_list);
			controller_createfreesound = fAudioSourcesFreeSound.add(parameters, "createFreesound");
			if (result.results.length > 0)
				this.freesound = result.results[0].previews['preview-hq-mp3'];
		}
		req.send();
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

	this.teleport = function() {
		Teleport(this.poi);
	};
  };
  
  parameters = new Inspector();



function Log(message, color) 
{
	var m = {};
	m.text = message;
	if (color === undefined)
	{
		m.color = '#AAA';
	}
	else if (color === 0)
	{
		m.color = '#FFF';
	}

	else if (color === 1)
	{
		m.color = '#0F0';
	}
	else if (color === 2)
	{
		m.color = '#FF0';
	}
	else if (color === 3)
	{
		m.color = '#F00';
	}
	else if (color === 4)
	{
		m.color = '#0BF';
	}
	logs.push(m);

	log_dirty = true;
	
}


function UpdateLog()
{
	//rerender if needs to
	if (log_dirty && ctx !== undefined)
	{
		log_dirty = false;
		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		logy = 10;
		
		var end = logs.length-1;
		var count = 21;
		var start =  end-count;
		if (start < 0)
			start = 0;
		for (var l=start;l<=end;++l)
		{
			var m = logs[l];
			ctx.fillStyle = m.color;
			ctx.fillText(m.text, logx, logy );
			logy+=10;
		}
	}
}
function _Log(message, color) 
{
	
	//fixme : refaire un rendu à chaque nouveau log?

	if (logy>250-10)
	{
		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		logy = 10;
	}
	if (color === undefined)
	{
		ctx.fillStyle = '#AAA';
	}
	else if (color === 0)
	{
		ctx.fillStyle = '#FFF';
	}

	else if (color === 1)
	{
		ctx.fillStyle = '#0F0';
	}
	else if (color === 2)
	{
		ctx.fillStyle = '#FF0';
	}
	else if (color === 3)
	{
		ctx.fillStyle = '#F00';
	}
	else if (color === 4)
	{
		ctx.fillStyle = '#AAF';
	}

	
	ctx.fillText(message, logx, logy );
	logy+=10;
}

function onWindowResize() {
	var height = window.innerHeight;
	camera.aspect = window.innerWidth / height;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, height);
	//if (ctx != undefined)
	//	ctx.canvas.width = window.innerWidth;
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
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
scene.add(camera);
renderer = new THREE.WebGLRenderer();
onWindowResize();
renderer.setClearColor(new THREE.Color(0x0088ff), 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
//renderer.shadowMap.type = THREE.BasicShadowMap;
document.body.appendChild(renderer.domElement);
renderer.domElement.ondrop = OnDrop;
renderer.domElement.ondragover = OnDragOver;
renderer.xr.enabled = true;

control = new TransformControls( camera, renderer.domElement );
control.space = "local";
control.setMode( "translate" );
//control.setMode( "rotate" );
//control.setMode( "scale" );
control.addEventListener( 'objectChange', OnControlChange );
scene.add( control );

fogColor = new THREE.Color(0x001133);



//scene.background = fogColor;
//scene.fog = new THREE.Fog(fogColor, 0.0025, 20);
//scene.fog.density = 0;
//scene.fog = new THREE.Fog(fogColor, 100, 200);

//cells of 10ksqm
/*
for (var x=-200;x<=200;x+=100)
{
	for (var z=-200;z<=200;z+=100)
	{
		AddGroundPlane(x,-10,z,95,95);
	}
}*/


/*
var BallWave = function() {
	this.waveHeight = 0.06;
	this.castShadow = true;
	this.color = "";
	this.explode = function() { };
	// Define render logic ...
  };
  var ballwave = new BallWave();
  
  

  
  var guiVR = dat.GUIVR.create( 'Ball Wave' );
  guiVR.add(ballwave, 'waveHeight')
  guiVR.add(ballwave, 'castShadow')
  guiVR.add(ballwave, 'explode')
  	// Choose from accepted values
	  guiVR.add(ballwave, 'color', ["rainbow", "yellow", "red", "blue"]);

  scene.add( guiVR ); // Add GUI to the scene

  guiVR.position.y = 10;

  dat.GUIVR.enableMouse( camera, renderer );
*/
  /*



var BallWave = function() {
	this.waveHeight = 0.06;
	this.castShadow = true;
	this.explode = function() { 

	};
	
  };
  var ballwave = new BallWave();
  var guiVR = dat.GUIVR.create( 'Ball Wave' );
  guiVR.add(ballwave, 'waveHeight')
  guiVR.add(ballwave, 'castShadow')
  guiVR.add(ballwave, 'explode')
  
  scene.add( guiVR ); // Add GUI to the scene
*/
  


//face the sun
camera.position.z = 0;
camera.position.y = 3;
camera.rotation.y = Math.PI/2;

//cursor
//var geometryCursor = new THREE.SphereBufferGeometry(0.02, 16, 8);
//var geometryCursor = new THREE.RingBufferGeometry( 0.05, 0.06, 32 );
var geometryCursor = new THREE.BoxGeometry( 0.02, 0.02, 0.02 );

var materialCursor = new THREE.MeshBasicMaterial({ color: 0xffffff });
cursor = new THREE.Mesh(geometryCursor, materialCursor);
cursor.position.x = 0;
cursor.position.y = 0;
cursor.position.z = -spawn_distance;
camera.add(cursor);	


/*
var geometrySelfie = new THREE.PlaneBufferGeometry( 0.1,0.1,1,1);
var materialSelfie = new THREE.MeshBasicMaterial({ color: 0xffffff });
selfie = new THREE.Mesh(geometrySelfie, materialSelfie);
selfie.position.x = 0;
selfie.position.y = 1;
selfie.position.z = -1;
camera.add(selfie);	
*/


//============================
//test rot
/*
var geometryPano = new THREE.SphereBufferGeometry(1, 16, 8);
var materialPano = new THREE.MeshStandardMaterial({ color: 0xffffff });
var pano = new THREE.Mesh(geometryPano, materialPano);
pano.position.x = 0;
pano.position.y = 10;
pano.position.z = 0;
rot(pano, -128.2, 18.32, -306.47);
scene.add(pano);
control.attach( pano);
*/
//============================


//var light = new THREE.PointLight(0xffffff, 1, 100);
var light = new THREE.DirectionalLight( 0xffffff, 1 );
//var light = new THREE.DirectionalLight( 0xffffff, 1.0 );
//light = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI / 5, 0.3 );
light.position.set(10,30, 0);
light.castShadow = false;
light.shadow.camera.near = 0.1;
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
water.material.uniforms.size.value = 4;
console.log(water.material.uniforms.size.value);
water.rotation.x = - Math.PI / 2;
water.position.y = 0;
scene.add( water );
if (PhysicsEnabled)
	physics.addMesh( water);

// Skybox
sky = new Sky();
var uniforms = sky.material.uniforms;
uniforms[ 'turbidity' ].value = 10;
uniforms[ 'rayleigh' ].value = 2;
uniforms[ 'luminance' ].value = 1;
uniforms[ 'mieCoefficient' ].value = 0.005;
uniforms[ 'mieDirectionalG' ].value = 0.8;

var cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 512, { format: THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );
cubeCamera = new THREE.CubeCamera( 0.1, 1, cubeRenderTarget );
//cubeCamera = new THREE.CubeCamera( 0.1, 100, 512 );
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





/*
var compressor = audioContext.createDynamicsCompressor();
compressor.threshold.setValueAtTime(-50, audioContext.currentTime);
compressor.knee.setValueAtTime(40, audioContext.currentTime);
compressor.ratio.setValueAtTime(12, audioContext.currentTime);
compressor.attack.setValueAtTime(0, audioContext.currentTime);
compressor.release.setValueAtTime(0.25, audioContext.currentTime);
listener_filter = compressor;
*/

/*
var biquad = audioContext.createBiquadFilter();
biquad.type = "lowpass";
biquad.frequency.setValueAtTime(300, audioContext.currentTime);
biquad.Q.setValueAtTime(10, audioContext.currentTime);
listener_filter = biquad;
*/

//listener.setFilter(listener_filter);

//loaders
gltfLoader = new GLTFLoader();
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


var profiler0 = 0;
var profiler1 = 0;
var profiler2 = 0;
var profiler3 = 0;
var profiler4 = 0;
var profiler5 = 0;
var profiler6 = 0;


function animate() {
	ProfilerStart();
	//requestAnimationFrame(animate);
	//frame++;
	//if (frame%2!==0) //cap to 30 FPS
	//return;

	stats.begin();
	var deadzone = 0.1;
	var dt = 1/60;

	if (gamepad_connected)
	{
		if (!gamepad_calibrated)
		{
			for (const pad of navigator.getGamepads()) 
			{
				if (pad != null)
				{
					GamepadCalibrate(pad);
				}
			}
		}
		for (const pad of navigator.getGamepads()) 
		{
			if (pad === null)
			continue;
			//console.log(pad);
			var movex = pad.axes[0]-pad_movex_center;
			var movey = pad.axes[1]-pad_movey_center;
			var lookx = pad.axes[2]-pad_lookx_center;
			var looky = pad.axes[3]-pad_looky_center;
			
			if (Math.abs(movex)>deadzone)
			{
				moveCameraRight(movex*avatar_speed*dt*2);
				avatar_dirty = true;
			}
			if (Math.abs(movey)>deadzone)
			{
				moveCameraForward(-movey*avatar_speed*dt*5);
				avatar_dirty = true;
			}

			if (Math.abs(lookx)<deadzone) lookx = 0;
			if (Math.abs(looky)<deadzone) looky = 0;

			if (lookx !== 0 || looky !== 0)
			{
				euler.setFromQuaternion(camera.quaternion);
				euler.y -= lookx * dt * 2;
				euler.x -= looky * dt * 2;
				euler.x = Math.max(- 3.14 / 2, Math.min(3.14 / 2, euler.x));
				camera.quaternion.setFromEuler(euler);
				avatar_dirty = true;
			}

			//actions


			for (var i in gamepad_buttons)
			{
				var b = gamepad_buttons[i];
				var c = pad.buttons[i].pressed;
				if (c && !b.laststate)
					b.pressed = true;
				else
					b.pressed = false;
				if (!c && b.laststate)
					b.released = true;
				else
					b.released = false;
				b.laststate = c;
				gamepad_buttons[i] = b;
			}
	

			if (gamepad_buttons[0].pressed)
			{
				ActionCube();
			}
			

		}
	}
	

	profiler0 = ProfilerStop();
	ProfilerStart();
	
	main_timer += dt;
	if (parameters.timeEnabled)
	{
		parameters.azimuth = parameters.azimuth+dt/360;
		if (parameters.azimuth > 1)
			parameters.azimuth -= 1;
		updateSun();
		water.material.uniforms[ 'time' ].value += dt;
	}

	profiler1 = ProfilerStop();
	ProfilerStart();

	if (MovingForward === true) {
		moveCameraForward(avatar_speed*dt);
		avatar_dirty = true;
	}
	if (MovingBackward === true) {
		moveCameraForward(-avatar_speed*dt);
		avatar_dirty = true;
	}
	if (MovingLeft === true) {
		moveCameraRight(-avatar_speed*dt);
		avatar_dirty = true;
	}
	if (MovingRight === true) {
		moveCameraRight(avatar_speed*dt);
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
	
	
	//send avatar position to the server
	var send_interval = 0.05; 
	if (avatarname !== "" && avatar_dirty && main_timer > 3)
	{
		

		send_timer += 1/30;
		if (send_timer > send_interval)
		{
			avatar_dirty = false;
			send_timer -= send_interval;
			//console.log("send_timer " + send_timer);
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
			//obj.r = Math.random();
			//obj.g = Math.random();
			//obj.b = Math.random();
			obj.scale = {};
			obj.scale.x = 1;
			obj.scale.y = 1;
			obj.scale.z = 1;
			obj.texture = avatar_texture_url;
			firebase.database().ref('spaces/test/objects/' + avatarname).set(obj);
		}
	}
	
	profiler1 = ProfilerStop();
	ProfilerStart();
	//Log(spawning_point);
	//streaming
	var refposition = new THREE.Vector3();
	refposition = camera.getWorldPosition(refposition);
	//console.log("refposition", refposition);
	if (spawning_point === undefined || spawning_point === "" || spawning_point === null)
	{
		var loading_threshold2 = loading_threshold*loading_threshold;
		var loading_hysteresis2 = (loading_threshold*1.1)*(loading_threshold*1.1);
		for (var j in space_objects)
		{
			var target = space_objects[j];
			var dist2 = GetDistance2(target.remote, refposition);
			if (dist2 < loading_threshold2 && !target.active)
			{
				target.active = true;
				target.object3D = createObject(target.remote);
				objects.push(target.object3D);
				objects_main[target.object3D.uuid] = target;
		
				//scripting
				if (target.remote.playing)
				{
					var script = {};
					script.target = target;
					//eval.call(target.remote.script, script); //using eval
					//eval(target.remote.script); //using eval
					var result = function(str){
						return eval(str);
					}.call(script,target.remote.script);

					target.script = script;
				}
			}
			else if (dist2 > loading_hysteresis2 && target.active)
			{
				DeleteObject(target.object3D);
				target.object3D = undefined;
				target.active = false;
			}
		}
	}	
	profiler2 = ProfilerStop();
	ProfilerStart();
	//execute scripts on objects
	for (var j in space_objects)
	{
		var target = space_objects[j];
		
		if (target.active && target.remote.script !== undefined && target.remote.playing)
		{
			try
			{
				if (target.script !== undefined)
					target.script.update();
			}
			catch (exception)
			{
				Log(exception,3);
				Log(target.remote.kind + ":" + target.remote.name);
				target.remote.playing = false;
				console.log("script stopped because of an exception");
			}
		}
	}
	profiler3 = ProfilerStop();
	ProfilerStart();
	//console.log("start");
	//compute all boxes
	for (var j in space_objects)
	{
		var r = space_objects[j];
		if ((r.remote.kind === "resonator" || r.remote.kind === "box") && r.active)
		{
			//update bounding box
			r.bb = new THREE.Box3();
			r.object3D.geometry.computeBoundingBox();
			r.bb.copy( r.object3D.geometry.boundingBox ).applyMatrix4( r.object3D.matrixWorld );
		}
	}

	for (var i in space_objects)
	{
		var o = space_objects[i];
		//console.log("o.afx = " , o.afx);
		if (o.active && o.object3D !== undefined && o.object3D.audio !== undefined && (o.object3D.convolver === undefined && o.object3D.fx === undefined))
		{
			//we have an active audio source
			var afx = undefined;
			var convolver = undefined;
			
			for (var j in space_objects)
			{
				var r = space_objects[j];
				if (r.active && (r.remote.kind === "resonator" || r.remote.kind === "box"))
				{
					var isInside = r.bb.containsPoint(o.object3D.position); //check if sound inside box
					if (isInside && o.object3D.audio.gain != undefined)
					{
						if ( r.object3D.convolver !== undefined)
						{
							//we are inside a convolver zone
							if (o.convolver !== r.object3D.convolver)
							{
								//there was a change
								o.object3D.audio.gain.disconnect(o.convolver); //we have to disconnect first
								o.convolver = r.object3D.convolver;
								o.object3D.audio.gain.connect(o.convolver);
								Log("connect " + o.remote.name + " -> " + r.remote.name + " " + o.convolver);
							}
							convolver = o.convolver;
						}	
						if (r.object3D.fx !== undefined)
						{
							//we are inside a box
							//console.log("inside box with fx " , r.object3D.fx);
							//we are inside a box
							if (o.afx !== r.object3D.fx)
							{
								//there was a change 
								o.object3D.audio.gain.disconnect(o.afx); //we have to disconnect first
								o.afx = r.object3D.fx;
								o.object3D.audio.gain.connect(o.afx);
								Log("connect " + o.remote.name + " -> " + r.remote.name + " " + o.afx);
							}
							afx = o.afx;
						}	
					}
				}
			}

			if (afx === undefined && o.afx !== undefined)
			{
				//Log("afx is " + afx);
				Log("disconnect " + o.remote.name + " -> " + r.remote.name + " " + o.afx);
				try
				{
					o.object3D.audio.gain.disconnect(o.afx);
				}
				catch (exception)
				{
					Log(exception, 3);
				}
				o.afx = undefined; 
			}
			
			if (convolver === undefined && o.convolver !== undefined)
			{
				Log("disconnect " + o.remote.name + " -> " + r.remote.name + " " + o.convolver);
				try
				{
					o.object3D.audio.gain.disconnect(o.convolver);
				}
				catch (exception)
				{
					Log(exception, 3);
				}
				o.convolver = undefined; 
			}
			if (afx === undefined && convolver === undefined)
			{
				//we reconnect to the listener is no fx or no convolver
				o.object3D.audio.gain.connect(o.object3D.audio.listener.getInput());
			}
		}
	}

	/*for (var i in space_objects)
	{
		var o = space_objects[i];
		if (o.active && o.object3D !==undefined && (o.convolver === undefined && o.afx === undefined) && o.object3D.audio !== undefined && o.object3D.audio.gain != undefined)
		{
			//source in free air (not inside at least 1 resonator), we disconnect it and connect directly to the listener
			//Log("connect to listener " + o.afx);
			o.object3D.audio.gain.disconnect();
			o.object3D.audio.gain.connect(o.object3D.audio.listener.getInput());
			o.convolver = undefined;
			o.afx = undefined;
		}
	}
	*/
	profiler4 = ProfilerStop();
	ProfilerStart();
	//console.log("end");
	renderer.render(scene, camera);
	profiler5 = ProfilerStop();
	ProfilerStart();
	UpdateLog();
	if (avatar_dirty)
	{
		minimap_dirty = true;
		//network_activity++;
		avatar_dirty = false;
	}
	UpdateMinimap();
	stats.end();
	profiler6 = ProfilerStop();

	//Log(""+profiler0+ " " + profiler1 + " " + profiler2 + " " + profiler3 + " " + profiler4 + " " + profiler5 + " " + profiler6);
	
	
}

//animate();
renderer.setAnimationLoop(animate);


function getNoise(duration)
{
	var channelCount = 1;
	var sampleCount = audioContext.sampleRate * duration;
	var buffer = audioContext.createBuffer(channelCount, sampleCount, audioContext.sampleRate);
  	for (var channel = 0; channel < channelCount; channel++) 
  	{
    	var data = buffer.getChannelData(channel);
		for (var i = 0; i < sampleCount; i++) 
		{
      		data[i] = Math.random() * 2 - 1;
		}
	}
	return buffer;
}







function roundDown(number, decimals) {
    decimals = decimals || 0;
    return ( Math.floor( number * Math.pow(10, decimals) ) / Math.pow(10, decimals) );
}

//creates a new atlantis object (on database demand)
function createObject(o) 
{
	var cube;
	
	Log("create object "+ o.kind + " " + o.name, 1);
	//console.log("create object "+ o.kind);
	var geometry;
	if (o.kind === "cube")
	{
		geometry = new THREE.BoxBufferGeometry();
	}
	else if (o.kind === "box")
	{
		geometry = new THREE.BoxBufferGeometry(5,5,5);
	}
	else if (o.kind === "sphere")
	{
		geometry = new THREE.SphereBufferGeometry(0.5,16,8);
	}
	else if (o.kind === "avatar")
	{
		geometry = new THREE.SphereBufferGeometry(0.5,16,8);
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
		//top radius / bottom radius / height
		geometry = new THREE.CylinderGeometry( 40, 50, 2, 16 );
	}
	else if (o.kind === "light")
	{	
		geometry = new THREE.SphereBufferGeometry( 0.1, 12, 6);
	}
	else 
	{
		geometry = new THREE.SphereBufferGeometry(0.5,12,6);
	}
	
	var material = null;
	var texture = null;
	if (o.texture !== undefined)
	{
		texture = new THREE.TextureLoader().load( o.texture );
		texture.wrapS = THREE.RepeatWrapping;
		texture.offset = new THREE.Vector2(-0.25,0);
	}

	

	if (o.kind === "light" || o.kind === "avatar")
	{	
		material = new THREE.MeshBasicMaterial({ map: texture });
	}
	else if (o.kind === "box" || o.kind === "resonator")
	{
		material = new THREE.MeshStandardMaterial({transparent:true,opacity:0.5, roughness:0.0, map: texture});
	}
	else
	{
		material = new THREE.MeshStandardMaterial({map: texture});
	}
	

	


	cube = new THREE.Mesh(geometry, material);
	cube.current_texture = o.texture;
	cube.position.x = o.x;
	cube.position.y = o.y;
	cube.position.z = o.z;
	

	cube.rotation.x = o.rotation.x;
	cube.rotation.y = o.rotation.y;
	cube.rotation.z = o.rotation.z;

	if (o.scale === undefined)
	{
		o.scale = {};
		o.scale.x = 1;
		o.scale.y = 1;
		o.scale.z = 1;
	}

	if (o.scale !== undefined)
	{
		cube.scale.x = o.scale.x;
		cube.scale.y = o.scale.y;
		cube.scale.z = o.scale.z;
	}
	
	if (o.kind !== "light" && o.kind !== "avatar")
	{
		material.color.r = o.r;
		material.color.g = o.g;
		material.color.b = o.b;
	}

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
	if (o.kind === "avatar" || o.kind === "resonator" || o.kind === "sound")
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
				curveSegments: 1,
				bevelEnabled: false,
				bevelThickness: 1,
				bevelSize: 0,
				bevelOffset: 0,
				bevelSegments: 5
			} );

			var materialText = new THREE.MeshPhongMaterial();
			var text = new THREE.Mesh(geometryText, materialText);
			cube.add(text);
			text.scale.set(0.01,0.01,0.01);
			text.position.y = 1;
			text.rotation.y = Math.PI;
			//console.log("text", text);
	}



	if (o.kind === "light")
	{
		var light = new THREE.PointLight(0xffffff, 1, 30, 2);
		cube.add(light);
	}
	else if (o.kind === "avatar")
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
			Log("read pd patch...", 0);
			//console.log("read pd patch:", o.pd);
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
			Log("PD patch loading exception:" + exception, 3);
			console.log("PD patch loading exception:", exception);
		}
		sound.setRefDistance( 1 );
		sound.setRolloffFactor(1.2);
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
		/*
		else if (o.kind === "eau")
		{
			var mediaElement = new Audio("sounds/banque/elements/eau.mp3");
			mediaElement.crossOrigin = "anonymous";
			mediaElement.loop = true;
			mediaElement.play();
			sound.setMediaElementSource( mediaElement );
		}
		*/
		else if (o.kind === "sound")
		{
			var audioLoader = new THREE.AudioLoader();
			audioLoader.load( o.url, function( buffer ) {
				//console.log("LOADED!", buffer);
				Log("loaded sound " + o.url + " - " + buffer.length/1000 + "k samples", 1);
			sound.setBuffer( buffer );
			sound.setLoop( true );
			sound.setVolume(1);
			if (o.aplaying === true)
			{
				sound.play();
			}
			else if (o.aplaying === false)
			{

			}
			else
			{
				sound.play();
			}
			
			},
			// onProgress callback
			function ( xhr ) {
				//console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
			},

			// onError callback
			function ( err ) {
				console.log( 'An error happened' );
				Log("error loading sound " + o.url, 3);
			}
			);
			sound.setRefDistance(1);
			sound.setRolloffFactor(1.2);
			sound.setMaxDistance(10000);
			sound.panner.panningModel = 'equalpower';
			//sound.panner.panningModel = 'HRTF';
			//linear inverse exponential
			sound.setDistanceModel("exponential");
			material.wireframe = true;
		}	

		else if (o.kind === "resonator")
		{
			cube.convolver = audioContext.createConvolver();
			var audioLoader = new THREE.AudioLoader();
			audioLoader.load( o.ir, function( buffer ) {
				console.log("LOADED!", buffer);
				Log("loaded IR " + o.ir, 1);
				cube.convolver.buffer = buffer;
			});
			sound.setRefDistance( 1 );
			sound.setRolloffFactor(1);
			sound.setDistanceModel("exponential");
			cube.convolver.connect( sound.listener.getInput() ); //connect to output
		}	
		else if (o.kind === "box")
		{
			var t = audioContext.currentTime;
			if (o.fx === "biquad")
			{
				cube.fx = audioContext.createBiquadFilter();
				cube.fx.type = "lowpass";
				cube.fx.frequency.setValueAtTime(300, t);
				cube.fx.Q.setValueAtTime(10, t);
			}
			else if (o.fx === "biquad_lowpass")
			{
				cube.fx = audioContext.createBiquadFilter();
				cube.fx.type = "lowpass";
				cube.fx.frequency.setValueAtTime(440, t);
				cube.fx.Q.setValueAtTime(20, t);
			}
			else if (o.fx === "biquad_highpass")
			{
				cube.fx = audioContext.createBiquadFilter();
				cube.fx.type = "highpass";
				cube.fx.frequency.setValueAtTime(440, t);
				cube.fx.Q.setValueAtTime(2, t);
			}
			else if (o.fx === "biquad_bandpass")
			{
				cube.fx = audioContext.createBiquadFilter();
				cube.fx.type = "bandpass";
				cube.fx.frequency.setValueAtTime(440, t);
				cube.fx.Q.setValueAtTime(2, t);
			}

			else if (o.fx === "biquad_lowshelf")
			{
				cube.fx = audioContext.createBiquadFilter();
				cube.fx.type = "lowshelf";
				cube.fx.frequency.setValueAtTime(440, t);
				cube.fx.gain.setValueAtTime(10, t);
			}

			else if (o.fx === "biquad_highshelf")
			{
				cube.fx = audioContext.createBiquadFilter();
				cube.fx.type = "highshelf";
				cube.fx.frequency.setValueAtTime(440, t);
				cube.fx.gain.setValueAtTime(2, t);
			}

			else if (o.fx === "biquad_peaking")
			{
				cube.fx = audioContext.createBiquadFilter();
				cube.fx.type = "peaking";
				cube.fx.frequency.setValueAtTime(440, t);
				cube.fx.Q.setValueAtTime(1, t);
				cube.fx.gain.setValueAtTime(2, t);
			}

			else if (o.fx === "biquad_notch")
			{
				cube.fx = audioContext.createBiquadFilter();
				cube.fx.type = "notch";
				cube.fx.frequency.setValueAtTime(440, t);
				cube.fx.Q.setValueAtTime(1, t);
			}

			else if (o.fx === "biquad_allpass")
			{
				cube.fx = audioContext.createBiquadFilter();
				cube.fx.type = "allpass";
				cube.fx.frequency.setValueAtTime(440, t);
				cube.fx.Q.setValueAtTime(20, t);
			}



			else if (o.fx === "compressor")
			{
				cube.fx = audioContext.createDynamicsCompressor();
				cube.fx.threshold.setValueAtTime(-50, t);
				cube.fx.knee.setValueAtTime(40, t);
				cube.fx.ratio.setValueAtTime(20, t);
				cube.fx.attack.setValueAtTime(0.01, t);
				cube.fx.release.setValueAtTime(0.3, t);
			}
			else if (o.fx === "delay")
			{
				cube.fx = audioContext.createDelay(10.0);
				cube.fx.delayTime.setValueAtTime(0.3, t);
			}
			else if (o.fx === "iir")
			{
				var feedforward = [0.1,0.1,-0.1,-0.1];
				var feedback = [0.005,0.005,0,0];
				cube.fx = audioContext.createIIRFilter(feedforward, feedback);
			}
			else if (o.fx === "waveshaper")
				cube.fx = audioContext.createWaveShaper();
			sound.setRefDistance(1);
			sound.setRolloffFactor(1.2);
			sound.setDistanceModel("exponential");
			if (cube.fx !== undefined)
			{
				cube.fx.connect( sound.listener.getInput() ); //connect to output
			}
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
	uploadModelFile(file);
}


function uploadModelFile(file, worldposition, worldrotation)
{
	var storage = firebase.storage();
	var storageRef = storage.ref(); // Create a storage reference from our storage service
	var audioRef = storageRef.child('models');
	var fileRef = audioRef.child(uuidv4());

	var url = fileRef.fullPath;
	Log("uploading to " + url, 2);
	fileRef.put(file).then(function(snapshot) 
	{
		console.log('Uploaded a blob or file! ');			
		var obj= getNewObjectCommand("model");
		if (worldposition !== undefined)
		{
			obj.x = worldposition.x;
			obj.y = worldposition.y;
			obj.z = worldposition.z;
		}

		if (worldrotation !== undefined)
		{
			obj.rotation.x = worldrotation.x;
			obj.rotation.y = worldrotation.y;
			obj.rotation.z = worldrotation.z;
		}
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
	Log("try to upload " + file.name, 2);
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
	Log("uploading to " + url, 2);
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

var avatar_texture_url = "";

function uploadAvatarTextureFile(file)
{
	var storage = firebase.storage();
	var storageRef = storage.ref(); // Create a storage reference from our storage service
	var audioRef = storageRef.child('avatars');
	var fileRef = audioRef.child(uuidv4());
	var url = fileRef.fullPath;
	Log("uploading to " + url, 2);
	fileRef.put(file).then(function(snapshot) 
	{
		console.log('Uploaded a blob or file! ');			
		fileRef.getDownloadURL().then(function(url) 
		{
			//store URL to update next time
			avatar_texture_url = url;
			console.log("avatar texture url:", avatar_texture_url);

		}).catch(function(error) {
			// Handle any errors
			Log("uploadAvatarTextureFile error", 1);
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
	PullTransformFromLocaObject(selection);
	UpdateRemoteObject(selection);
	/*if (selection !== undefined)
	{
		selection.remote.x = selection.object3D.position.x;
		selection.remote.y = selection.object3D.position.y;
		selection.remote.z = selection.object3D.position.z;
		selection.remote.rotation.x = selection.object3D.rotation.x;
		selection.remote.rotation.y = selection.object3D.rotation.y;
		selection.remote.rotation.z = selection.object3D.rotation.z;
		selection.remote.scale.x = selection.object3D.scale.x;
		selection.remote.scale.y = selection.object3D.scale.y;
		selection.remote.scale.z = selection.object3D.scale.z;
		//console.log("update selection", selection);
		firebase.database().ref('spaces/test/objects/' + selection.remote.id).set(selection.remote);
	}
	*/
}


function PullTransformFromLocaObject(o)
{
	if (o !== undefined)
	{
		o.remote.x = o.object3D.position.x;
		o.remote.y = o.object3D.position.y;
		o.remote.z = o.object3D.position.z;
		o.remote.rotation.x = o.object3D.rotation.x;
		o.remote.rotation.y = o.object3D.rotation.y;
		o.remote.rotation.z = o.object3D.rotation.z;
		o.remote.scale.x = o.object3D.scale.x;
		o.remote.scale.y = o.object3D.scale.y;
		o.remote.scale.z = o.object3D.scale.z;
	}
}


function UpdateRemoteObject(o)
{
	if (o !== undefined)
	{
		firebase.database().ref('spaces/test/objects/' + o.remote.id).set(o.remote);
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


var gamepad_connected = false;
var gamepad_calibrated = false;
var pad_movex_center = 0;
var pad_movey_center = 0;
var pad_lookx_center = 0;
var pad_looky_center = 0;
var gamepad_buttons = [];

var editor;


var elInfo = document.getElementById('info');
var elWebcam = document.getElementById('webcam');

var elVideo = document.createElement('video');
elVideo.height = 200;
elWebcam.appendChild(elVideo);

//audio recording

if (navigator.mediaDevices) 
{
	console.log('getUserMedia supported.');
	navigator.mediaDevices.getUserMedia ({audio: true, video: false})
	.then(function(stream) {
		
		// Create a MediaStreamAudioSourceNode
		// Feed the HTMLMediaElement into it
		var sourceNode = audioContext.createMediaStreamSource(stream);

		audioRecorder = new WebAudioRecorder(sourceNode, {
			workerDir: "js/",     // must end with slash
			encoding: "wav",
			channels: 1,
			timeLimit: 10,
			encodeAfterRecord: true
			});

		audioRecorder.onComplete = function(recorder, blob) 
		{ 
			//recording complete
			//console.log("blob:", blob);
			//center
			mouse.x = 0;
			mouse.y = 0;
			raycaster.setFromCamera( mouse, camera );
			var spawn_position = new THREE.Vector3();
			spawn_position = raycaster.ray.origin.clone();
			spawn_position.addScaledVector(raycaster.ray.direction, 5);
			//we upload the audio content in NA
			uploadAudioFile(blob, spawn_position);
		};
	})
	.catch(function(err) {
		console.log('The following gUM error occured: ' + err);
	});



	navigator.mediaDevices.getUserMedia ({audio: false, video: true})
	.then(function(stream) {
		elVideo.srcObject = stream;
		elVideo.onloadedmetadata = function(e) {
			elVideo.play();
			elVideo.muted = true;
		};

		
	})
	.catch(function(err) {
		console.log('The following gUM error occured: ' + err);
	});


} else {
	console.log('getUserMedia not supported on your browser!');
}



function capture(video, scaleFactor) {
    if(scaleFactor == null){
        scaleFactor = 1;
    }
    var w = video.videoWidth * scaleFactor;
    var h = video.videoHeight * scaleFactor;
    var canvas = document.createElement('canvas');
    //canvas.width  = 1024;
	//canvas.height = 1024;
	canvas.width  = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d');
	ctx.drawImage(video, 512-video.videoWidth/2, 512-video.videoHeight/2, w, h);
	ctx.drawImage(video, 0, 0, w, h);
    return canvas;
} 

var capture_canvas;

function StartDSP()
{
	capture_canvas = capture(elVideo);
	//elInfo.removeChild(elVideo);
	elVideo.pause();
	elVideo.srcObject = null;
	elVideo.src = "";
	//delete elVideo;
	
	

	
	var elMinimap = document.getElementById('minimap');
	var elEditor = document.getElementById( 'editor' );
	

	//log canvas
	ctx = document.createElement('canvas').getContext('2d');
	elInfo.appendChild(ctx.canvas);
	ctx.canvas.width = window.innerWidth/2;
	ctx.canvas.height = 230;
	ctx.fillStyle = '#000';
	ctx.strokeStyle = '#FFF';
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	
	

	chat_input = document.createElement('input');
	chat_input.placeholder = "chat or enter a command here";
	elInfo.appendChild(chat_input);

	chat_button = document.createElement('button');
	chat_button.textContent = "send";
	chat_button.onclick = function()
	{
		OnChat(chat_input.value);
		chat_input.value = "";
		
	};
	elInfo.appendChild(chat_button);
	
	//var editor = document.getElementById( 'editor' );
	editor = CodeMirror(elEditor, {
		value: "",
		mode:  "javascript"
	  });
	  //
	  //editor.setValue("//write your behavior below...");
	  editor.setSize("100%", 230);
	  run_button = document.createElement('button');
	  run_button.textContent = "run";
	  run_button.onclick = function()
	{
		ScriptCurrentSelection();
		PlayCurrentSelection();
		UpdateSelection();
	};
	elEditor.appendChild(run_button);

	
	stop_script_button = document.createElement('button');
	stop_script_button.textContent = "stop";
	stop_script_button.onclick = function()
	{
		StopCurrentSelection();
		UpdateSelection();
	};
	elEditor.appendChild(stop_script_button);

	elEditor.addEventListener('mousedown', (event) => {event.stopPropagation();});
	elInfo.addEventListener('mousedown', (event) => {event.stopPropagation();});

	
	ctx_minimap = document.createElement('canvas').getContext('2d');
	elMinimap.appendChild(ctx_minimap.canvas);
	ctx_minimap.canvas.width = 200;
	ctx_minimap.canvas.height = 200;
	ctx_minimap.fillStyle = '#000';
	ctx_minimap.strokeStyle = '#FFF';
	ctx_minimap.fillRect(0, 0, ctx_minimap.canvas.width, ctx_minimap.canvas.height);
	
	//selfie
	var elSelfie = document.getElementById('selfie');
	var ctxSelfie = document.createElement('canvas').getContext('2d');
	elSelfie.appendChild(ctxSelfie.canvas);
	ctxSelfie.canvas.width = 64;
	ctxSelfie.canvas.height = 48;
	ctxSelfie.drawImage(capture_canvas, 0, 0, 64, 48);


	

	function onMIDISuccess( midiAccess ) {
	Log( "MIDI ready!" , 1);
	

	midi = midiAccess;  // store in the global (in real usage, would probably keep in an object instance)
	//listInputsAndOutputs(midi);
	startLoggingMIDIInput(midi);
	}

	function onMIDIFailure(msg) {
	Log( "Failed to get MIDI access - " + msg , 3);
	}

	if (typeof navigator.requestMIDIAccess === 'function')
	{
		navigator.requestMIDIAccess().then( onMIDISuccess, onMIDIFailure );
	}
	else
	{
		Log( "Failed to get MIDI access", 3);
	}
	


	Login();
	Log("Welcome to New Atlantis...", 0);
	Log("If you have a gamepad, press any button to activate and calibrate it!", 0);


	//TestEval();

	if (avatarname === "")
		Log("You are spectator", 2)
	else
		Log("You are logged as " + avatarname, 1);
	
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
		//Log(errorMessage, 3);
	  });
	firebase.analytics();
	//console.log("firebase", firebase);
	var val = Math.random();


	if (avatarname !== "")
	{
		capture_canvas.toBlob(function(blob){
			console.log("ok webcam captured:", blob);
			uploadAvatarTextureFile(blob);
		}, 'image/jpeg', 0.95); // JPEG at 95% quality
	}
		

	document.addEventListener("touchstart", handleStart, false);
	document.addEventListener("touchend", handleEnd, false);
	document.addEventListener("touchcancel", handleCancel, false);
	document.addEventListener("touchleave", handleLeave, false);
	document.addEventListener("touchmove", handleMove, false);
	document.addEventListener('mousemove', onMouseMove, false);
	document.addEventListener('mousedown', (event) => {

		//Log("mousedown");
		if (editor.hasFocus())
			return;
		//if (document.activeElement === chat_input)
		//	return;
			
		//picking
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		raycaster.setFromCamera( mouse, camera );

		var intersections = raycaster.intersectObjects( objects, true );
		//console.log("intersection=" , intersections);
		//Log("dradding="+control.dragging);
		if ( intersections.length > 0  && !control.dragging) 
		{
			var last_selection = selection;
			object_selection = intersections[ 0 ].object;
			var object_name = object_selection.name;
			
			//console.log(object_selection);
			
			selection = objects_main[object_selection.uuid];
			
			
			//console.log("intersect with:",object_selection);
			//console.log("selection:",selection);	
			//get the first parent that is a NA object
			while (selection === undefined || object_selection.parent == undefined)
			{
				object_selection = object_selection.parent;
				selection = objects_main[object_selection.uuid];
				//console.log("intersect with:",object_selection);
				//console.log("selection:",selection);	
			}
			Log("clicked on " + selection.remote.name + " :: " + object_name + " now selected!", 2);
			if (parameters.editMode)
			{
				ObjectDrag = true;
				if (selection !== undefined)
				{
					if (selection.remote.script !== undefined)
					{
						editor.setValue(selection.remote.script);
					}
					else
						editor.setValue(na_library_default_script);
					//Activate ?
					if (last_selection === selection && selection.script !== undefined)
					{
						try
						{
							selection.script.onClick(object_name);
						}
						catch (exception)
						{
							Log(exception, 3);
						}
					}

					if (last_selection === selection)
					{
						//change control mode
						var mode = control.getMode();
						if (mode === "translate")
							control.setMode( "rotate" );
						else if (mode === "rotate")
							control.setMode( "scale" );
						else if (mode === "scale")
							control.setMode( "translate" );
					}
				}

					
				/*if (selection.remote.kind === "island")
				{
					//non draggable
					object_selection = undefined;
					selection = undefined;
					ObjectDrag = false;
					MouseDrag = true;
				}
				else*/
				if (object_selection !== undefined)
				{
					if (object_selection.material.emissive != undefined)
						object_selection.material.emissive.set( 0xaaaaaaaa );
				}

				if (selection !== undefined)
				{
					control.detach();
					control.attach( object_selection);
				}
			}
			else
			{
				//Activate ?
				//object_selection.material.emissive.set( 0xcccccccc );
				if (selection !== undefined && selection.script !== undefined)
				{
					try
					{
						selection.script.onClick(object_name);
					}
					catch (exception)
					{
						Log(exception, 3);
					}
				}
				object_selection = undefined;
				MouseDrag = true;
			}
			//console.log("selection set to:", selection);
		}
		else if (!control.dragging)
		{
			if (object_selection !== undefined)
			{
				if (object_selection.material.emissive != undefined)
					object_selection.material.emissive.set( 0x00000000 );
				object_selection = undefined;
			}
			control.detach();
			MouseDrag = true;
		}
		


	}, false);

	document.addEventListener('mouseup', (event) => {
		if (editor.hasFocus())
			return;
		//if (document.activeElement === chat_input)
		//	return;
		//if (document.activeElement === chat_input)
		//	return;
		MouseDrag = false;
		ObjectDrag = false;
		if (object_selection !== undefined)
		{
			if (object_selection.material.emissive != undefined)
				object_selection.material.emissive.set( 0x00000000 );
			object_selection = undefined;
		}
	}, false);


	document.addEventListener('keyup', (event) => {
		const nomTouche = event.key;
		//console.log("release:"+nomTouche);
		if (editor.hasFocus())
			return;
		//if (chat_input.hasFocus())
		//	return;
		//if (document.activeElement === chat_input)
		//	return;

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
				avatar_speed = 5;
			break;
		}
	}, false);

	document.addEventListener('keydown', (event) => {
		const nomTouche = event.key;
		//console.log("pressed:" + nomTouche);
		//if (editor.hasFocus())
		//	return;
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
				if (parameters.editMode && !(document.activeElement === chat_input))
				{
					DeleteCurrentSelection();
				}
			break;
			case 32: //space
			if (!(document.activeElement === chat_input))
			{
				if (selection !== undefined)
				{
					if (selection.remote.aplaying === false)
					{
						//Log("space play");
						selection.remote.aplaying = true;
					}
					else
					{
						//Log("space stop");
						selection.remote.aplaying = false;
					}
					UpdateRemoteObject(selection);

				}
			}
			break;
			case 13: //enter
			if ((document.activeElement === chat_input))
			{
				OnChat(chat_input.value);
				chat_input.value = "";
			}
			break;
			case 17: //control
				//ScriptCurrentSelection();
				//UpdateSelection();
			break;
			case 16: //shift
				avatar_speed = 340;
			break;
		}
	}, false);


	//FIXME : switch to a cell based space partitionning with streaming
var objectsRef = firebase.database().ref('spaces/test/objects');


objectsRef.on('child_changed', function (snapshot) {
	var object = snapshot.val();
	//console.log("changed", object);
	var selectedObject = space_objects[object.id];//scene.getObjectByName(object.id);
	selectedObject.remote = object;	
	if (selectedObject.object3D !== undefined)
	{
		UpdateLocalObject(selectedObject);
	}
	minimap_dirty = true;
	network_activity++;
});



objectsRef.on('child_added', function (snapshot) {
	var object = snapshot.val();
	//console.log("added", object);
	var newobj = {};
	newobj.remote = object;
	space_objects[object.id] = newobj;
	if (object.id === avatarname)
	{
		if (spawning_point === null || spawning_point === undefined)
		{
			console.log("restore avatar position", spawning_point );
			UpdateLocalCamera(newobj); //this avatar, we update camera with the last known position
		}
	}
	if (spawning_point === object.name)
	{
		
		Log("go to spawning point " + spawning_point, 1);
		var target = GetObjectByName(spawning_point)
		if (target !== undefined)
		{

			UpdateLocalCamera(target);
			Log("success", 1);
		}
		else
		{
			Log("failed", 3);
		}
		spawning_point = "";
	}
	
	if (object.kind === "avatar")
	{
		avatars.push(object.name);
		audio_notification.play();
	}
	minimap_dirty = true;
	network_activity++;
});



objectsRef.on('child_removed', function (snapshot) {
	var object = snapshot.val();
	//console.log("removed", object);
	var selectedObject = space_objects[object.id];
	//console.log("removing", selectedObject);
	DeleteObject(selectedObject.object3D);
	selectedObject.object3D = undefined;
	selectedObject.active = false;
	minimap_dirty = true;
	network_activity++;
	delete space_objects[object.id];
});



objectsRef.on('value', function (snapshot) {
	var object = snapshot.val();
	//console.log("value", object);
	//space_objects.remove(object.id)
});





//chat


var postsRef = firebase.database().ref('posts');
postsRef.on('child_changed', function (snapshot) {
	var object = snapshot.val();
	//console.log("posts changed", object);
});

postsRef.on('child_added', function (snapshot) {
	var object = snapshot.val();
	//console.log("posts added", object);
	var line = object.who + ": " + object.text;
	console.log("post : " + line);
	Log(line, 4);
	audio_notification.play();
	
});



postsRef.on('child_removed', function (snapshot) {
	var object = snapshot.val();
	//console.log("posts removed", object);
});


}

function StopDSP()
{
	Pd.stop();
}


function ActionCube()
{
	var obj= getNewObjectCommand("cube");
	obj.name = "cube";
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

function ActionObject(kind, name)
{
	Log("ActionObject " + name);
	var obj= getNewObjectCommand(kind);
	if (name !== undefined)
		obj.name = name;
	else
		obj.name = kind;
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

function ActionBox(fx)
{
	var obj= getNewObjectCommand("box");
	obj.name = fx;
	obj.fx = fx;
	firebase.database().ref('spaces/test/objects/' + obj.id).set(obj);
}


function DeleteCurrentSelection()
{
	control.detach();
	Log("delete object " + selection.remote.name + "(" + selection.remote.kind + ")", 2);
	firebase.database().ref('spaces/test/objects/' + selection.remote.id).remove();
	selection = undefined;
	object_selection = undefined;
	ObjectDrag = false;
}


function ScriptCurrentSelection()
{
	if (selection === undefined)
	{
		Log("no selection");
		return;
	}
	else
		Log("script object " + selection.remote.name + "(" + selection.remote.kind + ")", 2);
	selection.remote.script = editor.getValue();
	var target = selection;
	var script = {};
	script.target = target;
	var result = function(str){
		return eval(str);
	  }.call(script,selection.remote.script);
	selection.script = script;
}

function PlayCurrentSelection()
{
	if (selection === undefined)
	{
		Log("no selection");
		return;
	}
	else
		Log("play object " + selection.remote.name + "(" + selection.remote.kind + ")", 2);
	selection.remote.playing = true;
}

function StopCurrentSelection()
{
	if (selection === undefined)
	{
		Log("no selection");
		return;
	}
	else
		Log("play object " + selection.remote.name + "(" + selection.remote.kind + ")", 2);
	selection.remote.playing = false;
}






function SendMessageToCurrentSelection()
{
	Pd.send('diam', [200]);
}




function UpdateLocalObject(object)
{
	object.object3D.position.x = object.remote.x;
	object.object3D.position.y = object.remote.y;
	object.object3D.position.z = object.remote.z;
	object.object3D.rotation.x = object.remote.rotation.x;
	object.object3D.rotation.y = object.remote.rotation.y;
	object.object3D.rotation.z = object.remote.rotation.z;
	if (object.remote.r !== undefined)
		object.object3D.material.color.r = object.remote.r;
	if (object.remote.g !== undefined)
		object.object3D.material.color.g = object.remote.g;
	if (object.remote.b !== undefined)
		object.object3D.material.color.b = object.remote.b;

	if (object.object3D.current_texture !== object.remote.texture)
	{
		//texture changed we update
		object.object3D.material.map = new THREE.TextureLoader().load( object.remote.texture );
		object.object3D.material.needsUpdate = true;
		object.object3D.current_texture = object.remote.texture;
	}

	//audio play/stop
	if (object.object3D && object.object3D.audio)
	{
		if (object.remote.aplaying && !object.object3D.audio.isPlaying)
		{
			//should playx
			object.object3D.audio.play();
			Log("audio play", 2);
		}
		if (!object.remote.aplaying && object.object3D.audio.isPlaying)
		{
			//should stop
			object.object3D.audio.stop();
			Log("audio stop", 2);
		}
	}
}

function UpdateLocalCamera(object)
{
	//this avatar, we update camera with the last known position
	camera.position.x = object.remote.x;
	camera.position.y = object.remote.y;
	camera.position.z = object.remote.z;
	camera.rotation.x = object.remote.rotation.x;
	camera.rotation.y = object.remote.rotation.y;
	camera.rotation.z = object.remote.rotation.z;
}


function GetDistance2(object1, object2)
{
	var dx = object1.x-object2.x;
	var dy = object1.y-object2.y;
	var dz = object1.z-object2.z;
	return dx*dx+dy*dy+dz*dz;
}


var fAudioSources;
var f3D;
var fBox;
var fSpace;
var fAudioSourcesFreeSound;

function CreateGUI()
{
	dat.GUI.TEXT_CLOSED = "New Atlantis - Close controls";
	dat.GUI.TEXT_OPEN = "New Atlantis - Open controls";
	
	gui = new dat.GUI();
	gui.add(parameters, "editMode");
	gui.add(parameters, 'startTutorial');
	fAudioSources = gui.addFolder('Audio Source');
	f3D = gui.addFolder('3D Object');
	fBox = gui.addFolder('Box (modifier)');
	fSpace = gui.addFolder('Space (resonator)');



	var fSky = gui.addFolder( 'Sky' );
	fSky.add( parameters, 'inclination', 0, 0.5, 0.0001 ).onChange( updateSun );
	fSky.add( parameters, 'azimuth', 0, 1, 0.0001 ).onChange( updateSun ).listen();
	fSky.add( parameters, 'timeEnabled');
	
	var fAudioSourcesFile = fAudioSources.addFolder("Samples");
	fAudioSourcesFile.add(parameters, "source", na_library_sound);
	fAudioSourcesFile.add(parameters, "createSource");
	fAudioSourcesFile.add(parameters, "loadAudioFile");

	var fAudioSourcesRecording = fAudioSources.addFolder("Recording");
	fAudioSourcesRecording.add(parameters, "startRecording");
	fAudioSourcesRecording.add(parameters, "stopRecording");

	var fAudioSourcesPd = fAudioSources.addFolder("PureData");
	fAudioSourcesPd.add(parameters, "patch", na_library_patches);
	fAudioSourcesPd.add(parameters, "createPatch");
	fAudioSourcesPd.add(parameters, "loadPatch");

	fAudioSourcesFreeSound = fAudioSources.addFolder("FreeSound");
	fAudioSourcesFreeSound.add(parameters, "search");
	fAudioSourcesFreeSound.add(parameters, "searchFreesound");
	
	
	

	//fBox.add(parameters, "box1");
	//fBox.add(parameters, "box2");
	//fBox.add(parameters, "box3");

	fBox.add(parameters, "fx", na_library_fx);
	fBox.add(parameters, "createBox");



	fSpace.add(parameters, "ir", na_library_ir);
	fSpace.add(parameters, "createResonator");


	
	
	f3D.add(parameters, "object", na_library_objects);
	f3D.add(parameters, "name");
	f3D.add(parameters, "createObject");
	f3D.add(parameters, "loadModelFile");

	//gui.add(parameters, 'destroyAll');
	gui.add(parameters, 'position').listen();

	gui.add(parameters, "poi", na_pois);
	gui.add(parameters, "teleport");

	
	

	parameters.name = "name";
	parameters.volume = 1;

	gui.add(parameters, 'volume', 0, 1).onChange( setMasterVolume ).listen();
	
	// Iterate over all controllers
	for (var i in gui.__controllers) {
		gui.__controllers[i].updateDisplay();
	}

	gui.close();
}


function Teleport(poi)
{
	console.log("teleport to ", poi);
	const pos = JSON.parse(poi);
	camera.position.x = pos.x;
	camera.position.y = pos.y;
	camera.position.z = pos.z;
	avatar_dirty = true;

}

function setMasterVolume()
{
	listener.setMasterVolume(parameters.volume);
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
			Log("dropped " + file.name, 2);
			console.log("file" , file);
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
			if (file.name.endsWith('.glb'))
			{
				uploadModelFile(file, spawn_position, new THREE.Vector3(0,0,0));
			}
			else
			{
				uploadAudioFile(file, spawn_position);
			}

			
			
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


function OnControlChange()
{
	//Log("control change");
	UpdateSelection();
}
function OnDragOver(ev)
{

	ev.preventDefault();
    return false;
}


function OnChat(arg)
{
if (arg === "clear")
{
	firebase.database().ref('posts').set([]);
	Log("command clear OK!");
	return;
}
/*else if (arg === "destroyall")
{
	ActionDestroy();
	Log("command destroyall OK!");
	return;
}*/
else if (arg === "create cube")
{
	ActionCube();
	Log("command create cube OK!");
	return;
}
else if (arg === "whoishere")
{
	Log("command whoishere returned:", 2);
	var result = "";
	for (var i in avatars)
	{
		result += avatars[i] + "\n";		
		
	}
	Log(result, 0);
	console.log(result);
	return;
}
else if (arg === "stats")
{
	Log("command stats returned:", 2);
	Log("objects:" + space_objects.length, 0);
	Log("3D objects:" + objects.length, 0);
	Log("avatars:" + avatars.length, 0);
	
	return;
}
else if (arg.startsWith("distance"))
{
	var res = arg.split(' ');
	loading_threshold = res[1];
	Log("command distance returned:", 2);
	Log("loading_threshold set to: " + loading_threshold, 0);

	return;
}

else if (arg.startsWith("locate"))
{
	var res = arg.split(' ');
	var name = res[1];
	var found = false;
	for (var j in space_objects)
	{
		var target = space_objects[j];
		if (target.remote.name === name)
		{
			//go there
			UpdateLocalCamera(target);
			found = true;
		}
	}
	Log("command locate executed!", 2);
	if (!found)
	{
		Log("object not found!", 3);
	}
	else
	{
		Log("OK!", 1);
	}
	

	return;
}
else if (arg.startsWith("stop"))
{
	var res = arg.split(' ');
	var name = res[1];
	var target;
	if (name === undefined || name === "")
	{
		target = selection;
	}
	else
	{
		console.log("looking for ", name);
		target = GetActiveObjectByName(name)
	}
	if (target !== undefined && target.object3D !== undefined)
	{
		//target.object3D.audio.stop();
		//Log("audio stopped!", 2);
		target.remote.aplaying = false;
		UpdateRemoteObject(target);
	}
	return;
}

else if (arg.startsWith("play"))
{
	var res = arg.split(' ');
	var name = res[1];
	var target;
	if (name === undefined || name === "")
	{
		target = selection;
	}
	else
	{
		console.log("looking for ", name);
		target = GetActiveObjectByName(name)
	}
	if (target !== undefined && target.object3D !== undefined)
	{
		//target.object3D.audio.play();
		//Log("audio started!", 2);
		target.remote.aplaying = true;
		UpdateRemoteObject(target);
	}
	return;
}



	var postData = 
	{

	};
	if (avatarname === "")
		postData.who = "spectator";
	else
		postData.who = avatarname;
	postData.text = arg;

	// Get a key for a new Post.
	var newPostKey = firebase.database().ref().child('posts').push().key;

	// Write the new post's data simultaneously in the posts list and the user's post list.
	var updates = {};
	updates['/posts/' + newPostKey] = postData;
	firebase.database().ref().update(updates);
  
	//Log(arg);
}

function GamepadCalibrate(gamepad)
{
	pad_movex_center = gamepad.axes[0];
	pad_movey_center = gamepad.axes[1];
	pad_lookx_center = gamepad.axes[2];
	pad_looky_center = gamepad.axes[3];

	gamepad_calibrated = true;

	if (Math.abs(pad_movex_center)>0.1 || 
	Math.abs(pad_movey_center)>0.1 ||
	Math.abs(pad_lookx_center)>0.1 ||
	Math.abs(pad_looky_center)>0.1)
	{
		gamepad_calibrated = false;
	}
	gamepad.vibrationActuator.playEffect("dual-rumble", {
		startDelay: 0,
		duration: 200,
		weakMagnitude: 1.0,
		strongMagnitude: 1.0
	  });
}

window.addEventListener("gamepadconnected", function( event ) {
	GamepadCalibrate(event.gamepad);
	gamepad_connected = true;
	console.log("gamepadconnected", event.gamepad);
	for (var i=0;i<4;++i)
	{
		var b = {};
		b.pressed = false;
		b.released = false;
		b.laststate = false;
		gamepad_buttons[i] = b;
	}
});



function UpdateMinimap()
{
	if (!minimap_dirty)
		return;

	parameters.position = ""+roundDown(camera.position.x, 1)+";"+roundDown(camera.position.y,1)+";"+roundDown(camera.position.z,1);
	minimap_dirty = false;
	if (ctx_minimap !== undefined)
	{
		ctx_minimap.fillStyle = '#000';
		ctx_minimap.fillRect(0, 0, ctx_minimap.canvas.width, ctx_minimap.canvas.height);
		for (var j in space_objects)
		{
			var target = space_objects[j];

			var category = 0;
			if (target.remote.kind === "avatar")
			{
				category = 2;
			}
			else if (target.remote.kind === "sound")
			{
				category = 0;
			}
			else
			{
				category = 1;
			}
			if (!target.active)
			category = 9; //inactive
			PlotOnMinimap(target.remote, category);
		}
		//Log(network_activity);
		//PlotOnMinimap(camera.position, 3);

		PlotOnMinimap(camera.position, 3);
		/*
		var pos={};
		pos.x = 0;
		pos.y = 0;
		pos.z = 0;

		PlotOnMinimap(pos, network_activity%4);
		*/

		ctx_minimap.fillStyle = '#FFF';
		ctx_minimap.fillText("mess:"+network_activity + " d:" + network_bytes+" o:" + objects.length, 0, 200 );
	}
}


function PlotOnMinimap(worldposition, category)
{
	if (category === 0)
		ctx_minimap.fillStyle = '#F00';
	else if (category === 1)
		ctx_minimap.fillStyle = '#0F0';
	else if (category === 2)
		ctx_minimap.fillStyle = '#00F';
	else if (category === 3)
		ctx_minimap.fillStyle = '#FFF';
	else if (category === 4)
		ctx_minimap.fillStyle = '#FF0';
	else if (category === 5)
		ctx_minimap.fillStyle = '#0FF';
	else if (category === 6)
		ctx_minimap.fillStyle = '#F0F';
	else if (category === 7)
		ctx_minimap.fillStyle = '#7F7';
	else if (category === 8)
		ctx_minimap.fillStyle = '#F7F';
	else if (category === 9)
		ctx_minimap.fillStyle = '#777';
	//1pixel-100m scale
	var nx = Math.floor(100+(-worldposition.x)/50+0.5);
	var ny = Math.floor(100+(-worldposition.z)/50+0.5);
	ctx_minimap.fillRect(nx-1, ny-1, 3, 3);

}



//MIDI support

function listInputsAndOutputs( midiAccess ) 
{
	console.log(midiAccess.inputs);
	for (var input in midiAccess.inputs) {
	  Log( "Input port [type:'" + input.type + "'] id:'" + input.id +
		"' manufacturer:'" + input.manufacturer + "' name:'" + input.name +
		"' version:'" + input.version + "'" , 0);
	}
  
	for (var output in midiAccess.outputs) {
		console.log(midiAccess.outputs);
	  Log( "Output port [type:'" + output.type + "'] id:'" + output.id +
		"' manufacturer:'" + output.manufacturer + "' name:'" + output.name +
		"' version:'" + output.version + "'" , 0);
	}
  }

  function onMIDIMessage( event ) 
  {
	  // Mask off the lower nibble (MIDI channel, which we don't care about)
  switch (event.data[0] & 0xf0) {
    case 0x90:
	  if (event.data[2]!=0) 
	  {  
		  // if velocity != 0, this is a note-on message
		
		var channel = event.data[0]-144;
		Log("NoteOn " + channel + " " + event.data[1] + " " + event.data[2], 1);
		if (selection !== undefined && selection.script !== undefined)
		{
			try
			{
				selection.script.onMidiNoteOn(channel, event.data[1], event.data[2]);
			}
			catch (exception)
			{
				Log(exception, 3);
			}
		}
      
	  }
	  break;
      // if velocity == 0, fall thru: it's a note-off.  MIDI's weird, y'all.
    case 0x80:
		var channel = event.data[0]-128;
	  Log("NoteOff " + channel + " " + event.data[1] + " " + event.data[2], 2);
	  if (selection !== undefined && selection.script !== undefined)
		{
			try
			{
				selection.script.onMidiNoteOff(channel, event.data[1], event.data[2]);
			}
			catch (exception)
			{
				Log(exception, 3);
			}
		}
	  break;
	case 0xB0:
		var channel = event.data[0]-176;
		Log("ControlChange " + channel + " " + event.data[1] + " " + event.data[2], 4);
		if (selection !== undefined && selection.script !== undefined)
		{
			try
			{
				selection.script.onMidiControlChange(channel, event.data[1], event.data[2]);
			}
			catch (exception)
			{
				Log(exception, 3);
			}
		}
		break;
  }


	/*var str = "MIDI message received at timestamp " + event.timestamp + "[" + event.data.length + " bytes]: ";
	for (var i=0; i<event.data.length; i++) {
	  str += "0x" + event.data[i].toString(16) + " ";
	}
	console.log( str );
	*/
  }


  
  
  function startLoggingMIDIInput( midiAccess, indexOfPort ) {
	midiAccess.inputs.forEach( function(entry) 
	{
		console.log(entry);
		Log(entry.name, 0);
		entry.onmidimessage = onMIDIMessage;
	}
	);
  }

  function sendMiddleC( midiAccess, portID ) {
	var noteOnMessage = [0x90, 60, 0x7f];    // note on, middle C, full velocity
	var output = midiAccess.outputs.get(portID);
	output.send( noteOnMessage );  //omitting the timestamp means send immediately.
	output.send( [0x80, 60, 0x40], window.performance.now() + 1000.0 ); // Inlined array creation- note off, middle C,  
																		// release velocity = 64, timestamp = now + 1000ms.
  }


function TestEval()
{
	var code = 'console.log("script execute");Log("log from script");this.a = "a"; this.test = function(){console.log("test");console.log(this.a);};console.log(this);console.log("global scene:",scene);console.log("script execute end");';
	var script = {}; //context
	script.target = "target";
	//eval.call(script, code); //using eval
	//eval(code); //using eval
	//eval(target.remote.script); //using eval
	var result = function(str){
		return eval(str);
	  }.call(script,code);

	  script.test();
	console.log("script=", script);
				

}


function DeleteObject(object3D)
{
	scene.remove(object3D);
	const index = objects.indexOf(object3D);
	if (index > -1) 
	{
		objects.splice(index, 1);
	}
	if (object3D.audio !== undefined)
	{
		if (object3D.audio.source !== undefined)
		{
			object3D.audio.stop();
		}
		object3D.audio.gain.disconnect();
		if (object3D.audio.source !== undefined)
		{
			object3D.audio.source.disconnect();
		}
		object3D.audio.panner.disconnect();
		object3D.audio.gain = null;
		object3D.audio.source = null;
		object3D.audio.panner = null;
	}
}


function GetObjectByName(name)
{
	for (var j in space_objects)
	{
		var target = space_objects[j];
		if (target.remote.name === name)
		{
			return target;
		}
	}
	return undefined;
}

function GetActiveObjectByName(name)
{
	for (var j in space_objects)
	{
		var target = space_objects[j];
		if (target.remote.name === name && target.active)
		{
			return target;
		}
	}
	return undefined;
}


THREE.DefaultLoadingManager.onLoad = function ( ) {
	//console.log( 'Loading Complete!');
};


THREE.DefaultLoadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
	//console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
	network_bytes += itemsLoaded;
};

THREE.DefaultLoadingManager.onError = function ( url ) {
	//console.log( 'There was an error loading ' + url );
};



function rot(mesh, tilt_yaw, pitch, yaw)
{
	var deg2rad = Math.PI/180;

	//Quaternion q1 = Quaternion.AngleAxis(tilt_yaw, new Vector3(0,1,0));
	//Quaternion q = q1; //apply tilt_yaw
	var q1 = new THREE.Quaternion();
	var q = new THREE.Quaternion();
	q1.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), tilt_yaw*deg2rad );
	q = q1.clone();

	//Quaternion q2 = Quaternion.AngleAxis(pitch, new Vector3(0,0,1));
	//q = q*q2; //apply pitch correction
	//HERE I am not sure, maybe try several combinations of axis, angle sign...
	var q2 = new THREE.Quaternion();
	q2.setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), pitch*deg2rad );
	q = q.multiply(q2);

	//Quaternion q3 = Quaternion.Inverse(q1);
	//q = q*q3; //restore tilt_yaw
	var q3 = q1.clone();
	q3 = q3.inverse();
	q = q.multiply(q3);

	//Quaternion q4 = Quaternion.AngleAxis(yaw, new Vector3(0,1,0));
	//q = q*q4; //apply yaw
	var q4 = new THREE.Quaternion();
	q4.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), yaw*deg2rad );
	q = q.multiply(q4);


	//transform.rotation = q; //apply final resulting rotation
	console.log("q:", q);
	mesh.setRotationFromQuaternion(q);
}

var startTime;

function ProfilerStart()
{
	startTime = performance.now();
}
function ProfilerStop()
{
	const duration = performance.now() - startTime;
	return Math.floor(duration);
}


//const p = camera.getWorldPosition();
//console.log(p);


if (mode === 'vr')
{
	//VR
	//parameters.timeEnabled = false;
	water.visible = false;
	//sky.visible = false;
	//light.position.set(10,30, 0);
	//scene.background = new THREE.Color(0xAAAAAA);;
	loading_threshold = 200;
	document.getElementById('avatarname').value = "vr";
	scene.remove(camera);
	const cameraGroup = new THREE.Group();
	cameraGroup.add(camera);

	//in VR camera is handled by system
	//camera.position.set(0,1000,0);
	scene.add(cameraGroup);

	var materialSimpleSea = new THREE.MeshStandardMaterial({transparent:true,opacity:0.5, roughness:0.0});
	var geometrySimpleSea = new THREE.PlaneBufferGeometry(10000, 10000, 10, 10);
	var planeSimpleSea = new THREE.Mesh(geometrySimpleSea, materialSimpleSea);
	planeSimpleSea.rotation.setFromVector3(new THREE.Vector3(-Math.PI / 2, 0, 0));
	scene.add(planeSimpleSea);



	document.body.appendChild( VRButton.createButton( renderer ) );
	// controllers

	controller1 = renderer.xr.getController( 0 );
	controller1.addEventListener( 'selectstart', onSelectStart );
	controller1.addEventListener( 'selectend', onSelectEnd );
	cameraGroup.add( controller1 );

	controller2 = renderer.xr.getController( 1 );
	controller2.addEventListener( 'selectstart', onSelectStart );
	controller2.addEventListener( 'selectend', onSelectEnd );
	cameraGroup.add( controller2 );


	controller1.addEventListener( 'connected', function ( event ) {

		this.add( buildController( event.data ) );

	} );
	controller1.addEventListener( 'disconnected', function () {

		this.remove( this.children[ 0 ] );

	} );

	controller2.addEventListener( 'connected', function ( event ) {

		this.add( buildController( event.data ) );

	} );
	controller2.addEventListener( 'disconnected', function () {

		this.remove( this.children[ 0 ] );

	} );





	var controllerModelFactory = new XRControllerModelFactory();

	controllerGrip1 = renderer.xr.getControllerGrip( 0 );
	controllerGrip1.add( controllerModelFactory.createControllerModel( controllerGrip1 ) );
	cameraGroup.add( controllerGrip1 );

	controllerGrip2 = renderer.xr.getControllerGrip( 1 );
	controllerGrip2.add( controllerModelFactory.createControllerModel( controllerGrip2 ) );
	cameraGroup.add( controllerGrip2 );

	//

	var geometry = new THREE.BufferGeometry().setFromPoints( [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, - 1 ) ] );

	var line = new THREE.Line( geometry );
	line.name = 'line';
	line.scale.z = 5;

	controller1.add( line.clone() );
	controller2.add( line.clone() );

	//raycaster = new THREE.Raycaster();

	StartDSP();

	function onSelectStart( event ) {

		Log("onSelectStart");
		var temppos = new THREE.Vector3();
		const feetPos = renderer.xr.getCamera(camera).getWorldPosition(temppos);
		console.log("feetPos:", feetPos);

		var controller = event.target;
		const p = controller.getWorldPosition(temppos);
		console.log("controller worldpos:", p);
		// Set Vector V to the direction of the controller, at 1m/s
		const v = controller.getWorldDirection(temppos);

		console.log("dir:", v);
		// Scale the initial velocity to 6m/s
		//v.multiplyScalar(10);
		//const feetPos = renderer.xr.getCamera(camera).getWorldPosition();
		cameraGroup.position.addScaledVector(v,-10);

		
		
		return;
		var intersections = getIntersections( controller );

		if ( intersections.length > 0 ) {

			var intersection = intersections[ 0 ];

			var object = intersection.object;
			object.material.emissive.b = 1;
			controller.attach( object );

			controller.userData.selected = object;

		}

	}

	function onSelectEnd( event ) {

		Log("onSelectEnd");
		return;
		var controller = event.target;

		if ( controller.userData.selected !== undefined ) {

			var object = controller.userData.selected;
			object.material.emissive.b = 0;
			group.attach( object );

			controller.userData.selected = undefined;

		}


	}

	function getIntersections( controller ) {

		tempMatrix.identity().extractRotation( controller.matrixWorld );

		raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
		raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( tempMatrix );

		return raycaster.intersectObjects( group.children );

	}

	function intersectObjects( controller ) {

		// Do not highlight when already selected

		if ( controller.userData.selected !== undefined ) return;

		var line = controller.getObjectByName( 'line' );
		var intersections = getIntersections( controller );

		if ( intersections.length > 0 ) {

			var intersection = intersections[ 0 ];

			var object = intersection.object;
			object.material.emissive.r = 1;
			intersected.push( object );

			line.scale.z = intersection.distance;

		} else {

			line.scale.z = 5;

		}

	}

	function cleanIntersected() {

		while ( intersected.length ) {

			var object = intersected.pop();
			object.material.emissive.r = 0;

		}
	}
	function buildController( data ) {

		switch ( data.targetRayMode ) {

			case 'tracked-pointer':

				var geometry = new THREE.BufferGeometry();
				geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
				geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );

				var material = new THREE.LineBasicMaterial( { vertexColors: true, blending: THREE.AdditiveBlending } );

				return new THREE.Line( geometry, material );

			case 'gaze':

				var geometry = new THREE.RingBufferGeometry( 0.02, 0.04, 32 ).translate( 0, 0, - 1 );
				var material = new THREE.MeshBasicMaterial( { opacity: 0.5, transparent: true } );
				return new THREE.Mesh( geometry, material );

		}

	}


	//loop
	/*
	cleanIntersected();

					intersectObjects( controller1 );
					intersectObjects( controller2 );
					renderer.render( scene, camera );
					*/
}