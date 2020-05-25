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

var na_library_objects = {
	duck:'duck',
	cube:'cube',
	sphere:'sphere',
	torus:'torus',
	box:'box',
	knot:'knot',
	cylinder:'cylinder',
	cone:'cone',
	island:'island'
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
	very_far:'{"x":100000,"y":1,"z":0}'

};

