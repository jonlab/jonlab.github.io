import { GLTFLoader } from './examples/jsm/loaders/GLTFLoader.js';
import { Water } from './examples/jsm/objects/Water.js';
import { Sky } from './examples/jsm/objects/Sky.js';

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
var avatarname = "";
var main_timer = 0;
var send_timer = 0;
var avatar_dirty = false;
var space_objects = [];  //overall objects
var objects = []; //THREE objects
var objects_main = [];
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

var vec = new THREE.Vector3();
var dir = new THREE.Vector3();
var euler = new THREE.Euler(0, 0, 0, 'YXZ');


var Inspector = function() 
{
	this.distance = 400;
	this.inclination = 0.49;
	this.azimuth = 0.205;

	this.name = "untitled";
	this.URL = 'http://locus.creacast.com:9001/le-rove_niolon.mp3';
	//this.speed = 0.8;
	//this.displayOutline = false;
	this.color = [ 0, 128, 255 ]; // RGB array
	this.volume = 0.5;
	this.source = "sounds/banque/elements/eau.mp3"
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
	this.createPatch = function()
	{
		document.getElementById('pd').click();
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

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
renderer = new THREE.WebGLRenderer();
onWindowResize();
renderer.setClearColor(new THREE.Color(0x0088ff), 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
//renderer.shadowMap.type = THREE.BasicShadowMap;
document.body.appendChild(renderer.domElement);

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

//var light = new THREE.PointLight(0xffffff, 1, 100);
var light = new THREE.DirectionalLight( 0xffffff, 0.8 );
//var light = new THREE.DirectionalLight( 0xffffff, 1.0 );
//light = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI / 5, 0.3 );
light.position.set(10,30, 0);
light.castShadow = true;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 100;
light.shadow.bias = 0.0001;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;

scene.add(light);



// Water

var waterGeometry = new THREE.PlaneBufferGeometry( 10000, 10000 );

var water = new Water(
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


// Skybox

var sky = new Sky();

var uniforms = sky.material.uniforms;

uniforms[ 'turbidity' ].value = 10;
uniforms[ 'rayleigh' ].value = 2;
uniforms[ 'luminance' ].value = 1;
uniforms[ 'mieCoefficient' ].value = 0.005;
uniforms[ 'mieDirectionalG' ].value = 0.8;


var cubeCamera = new THREE.CubeCamera( 0.1, 1, 512 );
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
fontLoader = new THREE.FontLoader();




gltfLoader = new GLTFLoader();


//Flamingo.glb
//Parrot.glb
//Duck.glb
//Flower.glb





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
	var geometryPlane = new THREE.PlaneGeometry(sizex, sizez, 10, 10);
	var materialPlane = new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
	var plane = new THREE.Mesh(geometryPlane, materialPlane);
	//plane.setRotationFromEuler(0,0,0);
	plane.rotation.setFromVector3(new THREE.Vector3(-Math.PI / 2, 0, 0));
	plane.castShadow = false;
	plane.receiveShadow = true;
	plane.position.x = x;
	plane.position.y = y;
	plane.position.z = z;
	scene.add(plane);
}


function animate() {
	requestAnimationFrame(animate);
	main_timer += 1/60;
	water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
	if (MovingForward === true) {
		moveCameraForward(0.1);
		avatar_dirty = true;
	}
	if (MovingBackward === true) {
		moveCameraForward(-0.1);
		avatar_dirty = true;
	}
	if (MovingLeft === true) {
		moveCameraRight(-0.2);
		avatar_dirty = true;
	}
	if (MovingRight === true) {
		moveCameraRight(0.2);
		avatar_dirty = true;
	}

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

			firebase.database().ref('spaces/test/objects/' + avatarname).set(obj);

		}
	}

	renderer.render(scene, camera);
}


animate();




//creates a new atlantis object
function createObject(o) 
{
	var cube;
	if (o.kind === "duck")
	{
		gltfLoader.load( 'models/Duck.glb', function ( gltf ) 
		{
			//gltf.scene.scale.set(0.01,0.01,0.01);
			scene.add( gltf.scene);
		}, undefined, function ( error ) {
			console.error( error );
		} );
	}
	else
	{
		console.log("create object"+ o.kind);
		var geometry;
		if (o.kind === "cube")
		{
			geometry = new THREE.BoxGeometry();
		}
		else if (o.kind === "box")
		{
			geometry = new THREE.BoxGeometry();
		}
		else if (o.kind === "sphere")
		{
			geometry = new THREE.SphereGeometry(1,20,20);
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
		else 
		{
			geometry = new THREE.SphereGeometry(1,20,20);
		}
		
		var material = null;
		
		if (o.kind === "box")
		{
			material = new THREE.MeshStandardMaterial({transparent:true,opacity:0.5});
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

		if (o.kind !== "box")
		{
			cube.castShadow = true;
			cube.receiveShadow = false;
		}
		
		//material.color.setHex(Math.random() * 0xffffff );
		scene.add(cube);


		//texte
		if (o.kind === "avatar")// || o.kind === "stream" || o.kind === "sound")
		{
			
			if (o.name === undefined)
			o.name = "untitled";

				var geometryText = new THREE.TextGeometry( o.name, {
					font: font,
					size: 30,
					height: 1,
					curveSegments: 12,
					bevelEnabled: true,
					bevelThickness: 1,
					bevelSize: 0,
					bevelOffset: 0,
					bevelSegments: 5
				} );

				var materialText = new THREE.MeshStandardMaterial();
				var text = new THREE.Mesh(geometryText, materialText);
				cube.add(text);
				text.scale.set(0.02,0.02,0.02);
				text.position.y = 2;
				text.rotation.y = Math.PI;
				console.log("text", text);
			
		}
		if (o.kind === "avatar")
		{
		}
		else if (o.pd !== undefined)
		{
			var sound = new THREE.PositionalAudio( listener );
			try
			{
				console.log("read pd patch:", o.pd);
				patch = Pd.loadPatch(o.pd);
				//Pd.start();
				console.log("loaded patch:", patch);
				var out = patch.o(0);
				console.log("out:", out);


				var outnode = patch.o(0).getOutNode();
				console.log("out node", outnode);
				//patch.o(0).setWaa(Pd.getAudio().context.createGain(), 0);

				if (outnode !== undefined)
				{
					sound.setNodeSource(patch.o(0).getOutNode());
				}
			}
			catch (exception)
			{
				console.log("PD patch loading exception:", exception);
			}
			sound.setRefDistance( 1 );
			sound.setRolloffFactor(1);
			sound.setDistanceModel("exponential");
			//panner.panningModel = 'HRTF';
			//panner.distanceModel = 'inverse';
			//sound.offset = Math.random()*3;
			sound.play();
			cube.add(sound);
			cube.audio = sound;
			/*Pd.receive('tick', function(args) 
			{
				console.log('received a message from "tick" : ', args);
				//" color.setHex( Math.random() * 0xffffff );
				//selection.object3D.material.color.setHex(Math.random() * 0xffffff );
				selection.remote.r = Math.random();
				selection.remote.g = Math.random();
				selection.remote.b = Math.random();
				console.log("sending");
				firebase.database().ref('spaces/test/objects/' + selection.remote.id).set(selection.remote);
			});
			*/
			
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
				var mediaElement = new Audio(o.url);
				mediaElement.crossOrigin = "anonymous";
				mediaElement.loop = true;
				mediaElement.play();
				sound.setMediaElementSource( mediaElement );
				sound.setRefDistance( 1 );
				sound.setRolloffFactor(1.5);
				sound.setDistanceModel("exponential");
			}	
			cube.add(sound);
			cube.audio = sound;
		}
	}
		return cube;
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
		firebase.database().ref('spaces/test/objects/' + obj.id).set(obj);
	};
	reader.readAsText(input.files[0]);
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
	selection.remote.x = object_selection.position.x;
	selection.remote.y = object_selection.position.y;
	selection.remote.z = object_selection.position.z;
	//console.log("update selection", selection);

	firebase.database().ref('spaces/test/objects/' + selection.remote.id).set(selection.remote);
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
		object_selection.position.addScaledVector(vec, movementX*0.01);
		//camera.getWorldUp(dir);
		object_selection.position.addScaledVector(camera.up, movementY*-0.01);

		UpdateSelection();

		
	}
}


function handleStart()
{

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
	if (kind === "box")
	{
		obj.scale.x = 5;
		obj.scale.y = 3;
		obj.scale.z = 4;
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




function StartDSP()
{
	Login();
	var overlay = document.getElementById( 'overlay' );
	overlay.remove();

	CreateGUI();

	var options = {};
	options.audioContext = audioContext;
	Pd.start(options);

	// Initialize Firebase
	firebase.initializeApp(firebaseConfig);
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
			object_selection.material.emissive.set( 0xaaaaaaaa );
			selection = objects_main[object_selection.uuid];
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
	
	/*if (object.pd !== undefined)
	{
		console.log("object created : ", newobj);
	}*/
	objects.push(newobj.object3D);
	objects_main[newobj.object3D.uuid] = newobj;
	selection = newobj;
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

function ActionPatch()
{
	var obj= getNewObjectCommand("patch");
	firebase.database().ref('spaces/test/objects/' + obj.id).set(obj);
	
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
	obj.name = url;
	obj.url = url;
	firebase.database().ref('spaces/test/objects/' + obj.id).set(obj);
}

function DeleteCurrentSelection()
{
	firebase.database().ref('spaces/test/objects/' + selection.remote.id).remove();
	selection = undefined;
	object_selection = undefined;
	ObjectDrag = false;

}



function CreateGUI()
{
	dat.GUI.TEXT_CLOSED = "New Atlantis - Close controls";
	dat.GUI.TEXT_OPEN = "New Atlantis - Open controls";
	
	gui = new dat.GUI();
	var fAudioSources = gui.addFolder('Audio Source');
	var f3D = gui.addFolder('3D Object');
	var fBox = gui.addFolder('Box (modifier) (not impl.)');
	var fSpace = gui.addFolder('Space (resonator) (not impl.)');



	var folder = gui.addFolder( 'Sky' );
	folder.add( parameters, 'inclination', 0, 0.5, 0.0001 ).onChange( updateSun );
	folder.add( parameters, 'azimuth', 0, 1, 0.0001 ).onChange( updateSun );
				

	//fAudioSources.add(obj, "recorder");
	//fAudioSources.add(obj, "stream");
	//fAudioSources.add(obj, "synthesis");

	var sounds = [
		'http://locus.creacast.com:9001/le-rove_niolon.mp3',
		'http://locus.creacast.com:9001/acra_wave_farm.mp3',
		'http://locus.creacast.com:9001/deptford_albany.mp3',
		'./sounds/banque/elements/eau.mp3', 
		'./sounds/banque/elements/feu.mp3',
		'./sounds/banque/elements/vent.mp3',
		'./sounds/banque/animaux/gibbon.mp3',
		'./sounds/banque/animaux/oiseaux01.mp3',
		'./sounds/banque/animaux/oiseaux02.mp3',
		'./sounds/banque/animaux/poules.mp3',
		'./sounds/banque/animaux/ronronment.mp3',
		'./sounds/banque/corps.mp3',
		'./sounds/banque/synthese/essorage_grave.mp3',
		'./sounds/banque/synthese/gresillements_guitare.mp3',
		'./sounds/banque/synthese/terre_gargouillante00.mp3'
	];
	fAudioSources.add(parameters, "source", sounds);
	fAudioSources.add(parameters, "createSource");
	fAudioSources.add(parameters, "createPatch");

	fBox.add(parameters, "box1");
	fBox.add(parameters, "box2");
	fBox.add(parameters, "box3");

	fSpace.add(parameters, "space1");
	fSpace.add(parameters, "space2");
	fSpace.add(parameters, "space3");	

	f3D.add(parameters, "cube");	
	f3D.add(parameters, "knot");	
	f3D.add(parameters, "torus");	

	
	//gui.add(obj, 'name');
	//gui.add(obj, 'URL');
	//gui.add(obj, 'speed', -5, 5);
	//gui.add(obj, 'displayOutline');
	//gui.addColor(obj, 'color');
	//gui.add(obj, 'update');
	gui.add(parameters, 'destroyAll');
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

//export { startDSP2 };