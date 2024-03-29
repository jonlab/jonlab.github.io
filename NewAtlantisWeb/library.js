var na_library = {};

na_library.sounds = [
	{name:'le-rove_niolon',url:'http://locus.creacast.com:9001/le-rove_niolon.mp3'},
	{name:'acra_wave_farm',url:'http://locus.creacast.com:9001/acra_wave_farm.mp3'},
	{name:'deptford_albany',url:'http://locus.creacast.com:9001/deptford_albany.mp3'},
	{name:'eau',url:'sounds/banque/elements/eau.mp3'}, 
	{name:'feu',url:'sounds/banque/elements/feu.mp3'},
	{name:'vent',url:'sounds/banque/elements/vent.mp3'},
	{name:'gibbon',url:'sounds/banque/animaux/gibbon.mp3'},
	{name:'oiseaux01',url:'sounds/banque/animaux/oiseaux01.mp3'},
	{name:'oiseaux02',url:'sounds/banque/animaux/oiseaux02.mp3'},
	{name:'poules',url:'sounds/banque/animaux/poules.mp3'},
	{name:'ronronment',url:'sounds/banque/animaux/ronronment.mp3'},
	{name:'corps',url:'sounds/banque/corps.mp3'},
	{name:'essorage_grave',url:'sounds/banque/synthese/essorage_grave.mp3'},
	{name:'gresillements_guitare',url:'sounds/banque/synthese/gresillements_guitare.mp3'},
	{name:'terre_gargouillante00',url:'sounds/banque/synthese/terre_gargouillante00.mp3'}
];

/*
var na_library_sound = {
	stream_le_rove_niolon:'http://locus.creacast.com:9001/le-rove_niolon.mp3',
	stream_acra_wave_farm:'http://locus.creacast.com:9001/acra_wave_farm.mp3',
	stream_deptford_albany:'http://locus.creacast.com:9001/deptford_albany.mp3',
	water:'sounds/banque/elements/eau.mp3',
	fire:'sounds/banque/elements/feu.mp3',
	wind:'sounds/banque/elements/vent.mp3',
	gibbon:'sounds/banque/animaux/gibbon.mp3',
	birds01:'sounds/banque/animaux/oiseaux01.mp3',
	birds02:'sounds/banque/animaux/oiseaux02.mp3',
	hens:'sounds/banque/animaux/poules.mp3',
	purring:'sounds/banque/animaux/ronronment.mp3',
	body:'sounds/banque/corps.mp3',
	low_spin:'sounds/banque/synthese/essorage_grave.mp3',
	guitar:'sounds/banque/synthese/gresillements_guitare.mp3',
	earth:'sounds/banque/synthese/terre_gargouillante00.mp3'
};
*/

var na_library_sound = {
	AmbianceNuit:'sounds/banque/NEC/AmbianceNuit.mp3',
	AmbianceNuitMystere:'sounds/banque/NEC/AmbianceNuitMystere.mp3',
	Chuchotements01:'sounds/banque/NEC/Chuchotements01.mp3',
	Chuchotements02:'sounds/banque/NEC/Chuchotements02.mp3',
	Chuchotements03:'sounds/banque/NEC/Chuchotements03.mp3',
	ChuchotementsDroite:'sounds/banque/NEC/ChuchotementsDroite.mp3',
	ChuchotementsFemme01:'sounds/banque/NEC/ChuchotementsFemme01.mp3',
	ChuchotementsFemme02:'sounds/banque/NEC/ChuchotementsFemme02.mp3',
	ChuchotementsFemme03:'sounds/banque/NEC/ChuchotementsFemme03.mp3',
	ChuchotementsGhost:'sounds/banque/NEC/ChuchotementsGhost.mp3',
	Feuilles:'sounds/banque/NEC/Feuilles.mp3',
	leave:'sounds/banque/NEC/leave.mp3',
	leaves:'sounds/banque/NEC/leaves.mp3',
	leavessound:'sounds/banque/NEC/leavessound.mp3',
	MysteriousSound:'sounds/banque/NEC/MysteriousSound.mp3',
	NuitETE:'sounds/banque/NEC/NuitETE.mp3',
	Respiration:'sounds/banque/NEC/Respiration.mp3',
	RespirationGhost:'sounds/banque/NEC/RespirationGhost.mp3',
	SonMystere:'sounds/banque/NEC/SonMystere.mp3',
	stepleaves:'sounds/banque/NEC/stepleaves.mp3',
	stepsleaves:'sounds/banque/NEC/stepsleaves.mp3'

};





var na_toolbox = [
	{
		name:"object", 
		items:[
			{name:"SPHERE", data:"sphere"}, 
			{name:"CUBE", data:"cube"},
			{name:"DUCK", data:"duck"},

		], 
		current:0
	},
	{
		name:"sample", 
		items:[
			{name:"Feuilles", data:"sounds/banque/NEC/Feuilles.mp3"},
			{name:"ambianceNuit", data:"sounds/banque/NEC/AmbianceNuit.mp3"} ,
			{name:"SonMystere", data:"sounds/banque/NEC/SonMystere.mp3"} 

		], 
		current:0
	},
	{
		name:"stream", 
		items:[
			{name:"Marseille Frioul", data:"https://locus.creacast.com:9443/marseille_frioul.mp3"}, 
			{name:"Cyber Forest", data:"http://mp3s.nc.u-tokyo.ac.jp/Fuji_CyberForest.mp3"}
		], 
		current:0
	},
	
];






var na_library_objects = {
	duck:'duck',
	cube:'cube',
	sphere:'sphere',
	torus:'torus',
	box:'box',
	knot:'knot',
	cylinder:'cylinder',
	cone:'cone',
	island:'island',
	light: 'light',
	POI:"poi",
	portal:"portal"
};

var na_library_visuals = {
	custom:'custom',
	invisible:'invisible',
	cube:'cube',
	sphere:'sphere',
	torus:'torus',
	cylinder:'cylinder',
	cone:'cone',
	wireframe:'wireframe'
};



/*
var na_library_ir = {
	ir_0_entree_la_friche:'IR/0_entree_la_friche copie.wav',
	ir_1_tunnel_souterrain:'IR/1_tunnel_souterrain.wav',
	ir_2_sous_dome:'IR/2_sous_dome.wav',
	ir_3_parking:'IR/3_parking.wav',
	ir_4_skate_park:'IR/4_skate_park.wav',
	ir_5_cours:'IR/5_cours.wav',
	ir_6_escalier_rouge:'IR/6_escalier_rouge.wav',
	ir_7_passage_couvert:'IR/7_passage_couvert.wav',
	ir_8_entree_adjico:'IR/8_entree_adjico.wav',
	ir_9_allee_cache:'IR/9_allee_cache.wav',
	ir_10_jardin:'IR/10_jardin.wav',
	ir_11_villa:'IR/11_villa.wav',
	ir_12_entree_la_friche:'IR/12_entree_la_friche.wav',
	ir_13_2e_entree_GMEM:'IR/13_2e_entree_GMEM.wav',
	ir_14_2e_plateau:'IR/14_2e_plateau.wav',
	ir_15_toit:'IR/15_toit.wav',
	ir_16_terrasse_grandes_tables:'IR/16_terrasse_grandes_tables.wav',
	ir_17_jeu_enfant:'IR/17_jeu_enfant.wav',
	ir_18_francois_simon_bas:'IR/18_francois_simon_bas.wav',
	ir_19_jobin:'IR/19_jobin.wav',
	ir_20_decent_vers_dome:'IR/20_decent_vers_dome.wav',
	ir_21_etage_access_grandes_tables:'IR/21_etage_access_grandes_tables.wav',
	ir_22_francois_simon_haut:'IR/22_francois_simon_haut.wav',
	ir_nancy_lake_tunnel:'IR/NancyLakeTunnel.wav',
	cathedrale_st_pierre_2:'IR/IR_files/cathedrale_st_pierre_2.wav',
	cathedrale_st_pierre:'IR/IR_files/cathedrale_st_pierre.wav',
	niolon_1:'IR/IR_files/niolon_1.wav',
	niolon_3:'IR/IR_files/niolon_3.wav',
	niolon_fort_grande_cave_1:'IR/IR_files/niolon_fort_grande_cave_1.wav',
	niolon_fort_grande_cave_2:'IR/IR_files/niolon_fort_grande_cave_2.wav',
	niolon_fort_observatoire_1_mono:'IR/IR_files/niolon_fort_observatoire_1_mono.wav',
	niolon_fort_observatoire_1_stereo_large:'IR/IR_files/niolon_fort_observatoire_1_stereo_large.wav',
	niolon_fort_observatoire_2:'IR/IR_files/niolon_fort_observatoire_2.wav',
	niolon_fort_petite_salle:'IR/IR_files/niolon_fort_petite_salle.wav',
	niolon_tunnel:'IR/IR_files/niolon_tunnel.wav',
	niolon_valee_2:'IR/IR_files/niolon_valee_2.wav',
	niolon_valee:'IR/IR_files/niolon_valee.wav',
	panacee_cagedescaliers_2_mono:'IR/IR_files/panacee_cagedescaliers_2_mono.wav',
	panacee_cagedescaliers_2:'IR/IR_files/panacee_cagedescaliers_2.wav',
	salon_35_faubourg_du_courreau:'IR/IR_files/salon_35_faubourg_du_courreau.wav',
	theatre_vignette_zoom_1_widestereo:'IR/IR_files/theatre_vignette_zoom_1_widestereo.wav',
	theatre_vignette_zoom_1:'IR/IR_files/theatre_vignette_zoom_1.wav',
	theatre_vignette_zoom_2:'IR/IR_files/theatre_vignette_zoom_2.wav',
	theatre_vignette_zoom_3:'IR/IR_files/theatre_vignette_zoom_3.wav',
	theatre_vignette_zoom_4:'IR/IR_files/theatre_vignette_zoom_4.wav'

	

};

*/

var na_library_ir = {
	bathroom:'IR/lib/bathroom.wav',
	cathedral_Saint_Pierre:'IR/lib/cathedral_Saint_Pierre.wav',
	empty_city_lockdown_covid_montpellier_2:'IR/lib/empty_city_lockdown_covid_montpellier_2.wav',
	gandalou_2_tail:'IR/lib/gandalou_2_tail.wav',
	large_room_1_mono:'IR/lib/large_room_1_mono.wav',
	large_room_1:'IR/lib/large_room_1.wav',
	low_ceiling_open_space:'IR/lib/low_ceiling_open_space.wav',
	niolon_circular_cliff:'IR/lib/niolon_circular_cliff.wav',
	niolon_fort_big_room:'IR/lib/niolon_fort_big_room.wav',
	niolon_fort_cave:'IR/lib/niolon_fort_cave.wav',
	niolon_tunnel:'IR/lib/niolon_tunnel.wav',
	niolon_valley_1:'IR/lib/niolon_valley_1.wav',
	niolon_valley_2:'IR/lib/niolon_valley_2.wav',
	observatory:'IR/lib/observatory.wav',
	salle_quartz_2:'IR/lib/salle_quartz_2.wav',
	semi_open_room:'IR/lib/semi_open_room.wav',
	small_stairway_carpeted_walls_1:'IR/lib/small_stairway_carpeted_walls_1.wav',
	small_stairway_carpeted_walls_2:'IR/lib/small_stairway_carpeted_walls_2.wav',
	stairway_very_reverberant_1:'IR/lib/stairway_very_reverberant_1.wav',
	stairway_very_reverberant_2:'IR/lib/stairway_very_reverberant_2.wav',
	under_bridge:'IR/lib/under_bridge.wav',
	wharehouse_papeterie_Arles_tail:'IR/lib/wharehouse_papeterie_Arles_tail.wav'
};

var na_library_fx = {
	biquad_lowpass:'biquad_lowpass',
	biquad_highpass:'biquad_highpass',
	biquad_bandpass:'biquad_bandpass',
	biquad_lowshelf:'biquad_lowshelf',
	biquad_highshelf:'biquad_highshelf',
	biquad_peaking:'biquad_peaking',
	biquad_notch:'biquad_notch',
	biquad_allpass:'biquad_allpass',
	compressor:'compressor',
	delay:'delay',
	iir:'iir',
	waveshaper:'waveshaper'
};

var na_library_patches = 
{
	pd_input_modulation:'pd/adc_osc.pd',
	//pd_delays:'pd/delays.pd',
	pd_metro:'pd/metro.pd',
	FmBass:'pd/FmBass.pd',
	Square:'pd/Square.pd'


};


var na_pois = 
{
	origin:'{"x":0,"y":1,"z":0}',
	underwater:'{"x":0,"y":-10,"z":0}',
	ocean_limit:'{"x":5000,"y":1,"z":0}',
	very_far:'{"x":100000,"y":1,"z":0}',
	voices:'{"x":-1117,"y":10,"z":-2420}',
	cailloux:'{"x":-1923,"y":4,"z":-994}'

};


var na_library_default_script = '//this is a New Atlantis script\nthis.update = function(dt)\n{\n  //update code\n};\nthis.onClick = function()\n{\n  Log("click");\n};';
