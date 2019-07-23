$(function(){
	initBtnMain();
});

var bornesParcelle = [];

function initBtnMain(){
	$(".btnObtenirCoordonneesGeographique").unbind("click").promise().done(function(){
		$(this).click(function(){
			if(!$(this).parent().siblings(".coordonneesGeographique").is(":visible")){
				$(this).parent().siblings(".coordonneesGeographique").slideDown("fast");
			}
			var number = parseInt($(this).attr("numero"));
			var elt = $(this);
			getLocation(number,function(position,num){
				bornesParcelle[num]=position.coords;
				var texte = '<br/>'+
							'<div>Lat: <span>'+position.coords.latitude+'</span> &deg;</div>'+
							'<div>Long: <span>'+position.coords.longitude+'</span> &deg;</div>';
							
				elt.parent().siblings(".coordonneesGeographique").html(texte);
			});
		});
	});
	
	$("#btnAnnulerEnregistrement").unbind("click").promise().done(function(){
		$(this).click(function(){
			myApp.dialog.confirm("&Ecirc;tes-vous sur d'annuler l'enregistrement des bornes","Annulation",function(){
				bornesParcelle = [];
				$(".coordonneesGeographique").text("");
			});
		});
	});
	
	$("#btnEnvoyerEnregistrement").unbind("click").promise().done(function(){
		$(this).click(function(){
			if(bornesParcelle.length == 4){
				myApp.preloader.show();
				$.ajax({
					method:"POST",
					url:"****************/envoibornes.php",
					data:{data:bornesParcelle},
					success:function(data){
						myApp.preloader.hide();
						data = eval(data);
						$("#popoverIdDeLaParcelle h1").text(data[0]['parcelle']);
						//myApp.popover.get("#popoverIdDeLaParcelle").open();
						myApp.popover.create({
							"content":'<div class="popover" id="popoverIdDeLaParcelle">'+
											'<div class="popover-inner" style="padding:10px;text-align:center;">'+
												'ID des coordonn&eacute;es de la parcelle'+
												'<h1 style="border-top:1px solid #d7d7d7;margin-bottom: 0px;">'+data[0]['parcelle']+'</h1>'+
												'<div style="padding:10px;"><small>Rassurez-vous d\'avoir communiqu&eacute; cet identifiant &agrave; l\'op&eacute;rateur.</small></div>'+
												'<div><button class="button popover-close button-fill color-orange">Fermer</button></div>'+
											'</div>'+
										'</div>',
										
							"targetX":29,
							"targetY":150,
							closeByBackdropClick:false
						}).open();
					},fail:function(){
						myApp.preloader.hide();
						myApp.dialog.alert("Echec de connexion &agrave; l'Internet.","Re&eacute;ssayer l'envoi");
					}
				});
				
			}else{
				myApp.dialog.alert("Vous n'avez pas encore enregistr&eacute; toutes les bornes.","Bornes non compl&egrave;te");
			}
		});
	});
}

var bornes = [];

function getLocation(indexBorne,callback){
	myApp.preloader.show();
	navigator.geolocation.getCurrentPosition(function(position){
		myApp.preloader.hide();
		bornes[indexBorne] = {};
		bornes[indexBorne].position = position;
		if(typeof callback == "function") callback(position,indexBorne);
	},function(){
		myApp.preloader.hide();
	},{
	  enableHighAccuracy: true, 
	  maximumAge        : 30000, 
		timeout           : 27000
	});
}

