// Variable global eTag, per a controlar la concurrencia
var eTag;
$(document).ready(function() {
// Carreguem el fitxer xml de generacions
	var name;
	var id = getUrlParameter('id');
// Llegim del fitxer xml de les generacions
	$.get("/generation/", function(xml) {
		$(xml).each(function() {
			var name = $(this).attr('name');
			var id = $(this).attr('id');
			// Cridem a les funcions per a pintar el menu i les taules de la plana d'inici
			printMenu(name, id);
			printTableHome(name, id, xml);
		});
	}).fail(function(jqXHR, textStatus, errorThrown) {
		// Si hi ha qualque error, obrim un modal i li mostrem la informacio al usuari
		if (jqXHR.status == 404) {
			 window.location.replace('/flag/404.html');
		} else {
			$('#modalGen').modal('show');
			printModal('Error', 'Error ' + jqXHR.status, null);
		}
	});
	// Si estem a una de les generacions, pintem la seva informacio
	if (id!=null){
		var url = '/generation/'+id;
		// Cridada HEAD AJAX per a obtenir el camp eTag
		$.ajax({
			url: url,
			type: 'HEAD',
			dataType : 'xml',
			success: function( data, textStatus, jqXHR ) {
				// Recuperem de la capcalera el camp eTag
				eTag= jqXHR.getResponseHeader('ETag');
			}
		});
		// Llegim del fitxer xml dels anys i modes
		$.get("/year-mode/", function(xml) {
			$(xml).each(function() {
				var years = $(this).attr('years');
				var mode = $(this).attr('mode');
				// Pintem els valors de year
				years.forEach( function(value) {
					printYM(value, "#year");
				});
				// Pintem els valors de mode
				mode.forEach( function(value) {
					printYM(value, "#mode");
				});
			});
		}).fail(function(jqXHR, textStatus, errorThrown) {
			// Si hi ha qualque error, obrim un modal i li mostrem la informacio al usuari
			if (jqXHR.status == 400) {
				$('#modalGen').modal('show');
				printModal('Petició incorrecta', 'Error ' + jqXHR.status, null);
			} else if (jqXHR.status == 404) {
				 window.location.replace('/flag/404.html');
			} else if (jqXHR.status == 409) {
			    $('#modalGen').modal('show');
				printModal('Conflicte amb les dades', 'Error ' + jqXHR.status, null);
			} else if (jqXHR.status == 412) {
				// Si hi ha un error de concurrencia, es crida a la funcio de concurrentError
				concurrentError();
			} else {
				$('#modalGen').modal('show');
				printModal('Error', 'Error ' + jqXHR.status, null);
			}
		});
	// Llegim del fitxer xml per pintar les files de la taula, l'any i mode i el nom de la generacio
		$.ajax({
			url: url,
			type: 'GET',
			dataType : 'xml',
			success: function(xml, textStatus, jqXHR) {
				// Pintem el valor de year i mode que esta guardat a la base de dades
				$("#year").val($(xml).find("generation").attr('year'));
				$("#mode").val($(xml).find("generation").attr('mode'));
				// Recuperem de la base de dades el nom de la generacio i ho pintem a la pestanya del navegador
				var name = $(xml).find("generation").attr('name');
				document.title = name;
				// Pintem el nom de la generacio al breadcrumb de la plana
				$(".breadcrumb .active").append(name);
				$(".col-12 span").append(name);
				// Recuperem de la base de dades, els camps de la taula de les generacions per pintar-la
				$(xml).find("flags").each(function() {
					var name = $(this).attr('name');
					var value = $(this).attr('value');
					var initDate = $(this).attr('initDate');
					var endDate = $(this).attr('endDate');
					var idFlag = $(this).attr('id');
					var eTagFlag = $(this).attr('version');
					if (value == undefined) {
						value='';
					}
					// Funcio per a pintar la taula
					printTable(idFlag, name, value, initDate, endDate, eTagFlag, "#dataTable");
				});
				// Funcio per a fer responsive la plana
				screenResponsive();
			}
		}).fail(function(jqXHR, textStatus, errorThrown) {
			// Si hi ha qualque error, obrim un modal i li mostrem la informacio al usuari
			if (jqXHR.status == 404) {
				 window.location.replace('/flag/404.html');
			} else {
				$('#modalGen').modal('show');
				printModal('Error', 'Error ' + jqXHR.status, null);
			}
		});
	}
});

// Actualitzem les dades i les pintam
function upDate(data) {
	var id = getUrlParameter('id');
	// Esborrem totes les fileres de les taules i els noms del menu, per a despres tornar-ho a pintar amb la informacio actualitzada de la base de dades
	$(".allGen").remove();
	// Llegim del fitxer xml dels anys i modes
	$.get("/year-mode/", function(xml) {
		$(xml).each(function() {
			var years = $(this).attr('years');
			var mode = $(this).attr('mode');
			// Pintem els valors de year
			years.forEach( function(value) {
				printYM(value, "#year");
			});
			// Pintem els valors de mode
			mode.forEach( function(value) {
				printYM(value, "#mode");
			});
		});
	}).fail(function(jqXHR, textStatus, errorThrown) {
		// Si hi ha qualque error, obrim un modal i li mostrem la informacio al usuari
		if (jqXHR.status == 404) {
			 window.location.replace('/flag/404.html');
		} else {
			$('#modalGen').modal('show');
			printModal('Error', 'Error ' + jqXHR.status, null);
		}
	});
	$.get("/generation/", function(xml) {
		$(xml).each(function() {
			var name = $(this).attr('name');
			var id = $(this).attr('id');
			printMenu(name, id);
			printTableHome(name, id, xml);
		});
	}).fail(function(jqXHR, textStatus, errorThrown) {
		// Si hi ha qualque error, obrim un modal i li mostrem la informacio al usuari
		if (jqXHR.status == 404) {
			 window.location.replace('/flag/404.html');
		} else {
			$('#modalGen').modal('show');
			printModal('Error', 'Error ' + jqXHR.status, null);
		}
	});
	// Si estem a una de les generacions, pintem la seva informacio
	if (id!=null){
		var url = '/generation/'+id+'.xml';
		// Cridada HEAD AJAX per a obtenir el camp eTag
		$.ajax({
			url: url,
			type: 'HEAD',
			dataType : 'xml',
			success: function( data, textStatus, jqXHR ) {
				// Recuperem de la capcalera el camp eTag
				eTag = jqXHR.getResponseHeader('ETag');
			}
		});
		// Llegim del fitxer xml per pintar les files
		$.get(url, function(xml) {
			// Pintem el valor de year i mode que esta guardat a la base de dades
			$("#year").val($(xml).find("generation").attr('year'));
			$("#mode").val($(xml).find("generation").attr('mode'));
			// Recuperem de la base de dades, els camps de la taula de les generacions per pintar-la
			$(xml).find("flags").each(function() {
				var name = $(this).attr('name');
				var value = $(this).attr('value');
				var initDate = $(this).attr('initDate');
				var endDate = $(this).attr('endDate');
				var idFlag = $(this).attr('id');
				var eTagFlag = $(this).attr('version');
				if (value == undefined) {
					value='';
				}
				// Funcio per a pintar la taula
				printTable(idFlag, name, value, initDate, endDate, eTagFlag, "#dataTable");
			});
			// Funcio per a fer responsive la plana
			screenResponsive();
		}).fail(function(jqXHR, textStatus, errorThrown) {
			// Si hi ha qualque error, obrim un modal i li mostrem la informacio al usuari
			if (jqXHR.status == 404) {
				 window.location.replace('/flag/404.html');
			} else {
				$('#modalGen').modal('show');
				printModal('Error', 'Error ' + jqXHR.status, null);
			}
		});
	}
}

// Pintem el menu
function printMenu(name, id) {
	var formMenu;
	// Pintem la primera lletra del nom de cada generacio en el menu, quan col·lapsem el menu
	var inLletra = name.substr(0,1);
	// Fileres de la llista del menu
	formMenu = '<li class="nav-item '+ id +' allGen" data-toggle="tooltip" data-placement="right"><a class="nav-link" href="generation-study.html?id=' + id + '"><span class="inLletra nav-none">' + inLletra + '</span><span class="nav-link-text">' + name + '</span></a></li>';
	$("#menuGeneration").append(formMenu);
}

// Modifiquem els noms del menu quan fem el menu mes petit
$("#sidenavToggler").click(function(){
    $(".inLletra").toggleClass("nav-none");
});

// Pintem les taules de les generacions
function printTableHome(name, id, flagAjax) {
	var url;
	// Definim el id de la taula
	var idTable = "table" + name;
	var formTable = "";
	// Taula de tamany de 6 columnes de Bootstrap
	formTable += '<div class="col-md-6 '+ id +' allGen"><h2>';
	formTable += '<a class="estudi" href="generation-study.html?id=' + id + '"title="Editar ' + name + '">' + name + '	<i class="fa fa-edit"></i></a>';
	formTable += ' <a href="#" class="rmGInd" data-toggle="modal" data-target="#modalGen" data-name="' + name + '" data-id="' + id + '" onclick="remove(this)" title="Esborrar ' + name + '"><i class="fa fa-trash"></i></a>';
	formTable += '</h2><div class="table-responsive"><table class="table" id="' + idTable;
	formTable += '" width="100%" cellspacing="0"><thead><tr><th class="col-md-5">Nom</th><th class="col-md-1">Valor</th></tr></thead><tbody></tbody></table></div></div>';
	$("#genTables").append(formTable);
	// Emplenem les taules amb les dades de les generacions que tenim al array flagAjax
	for (var i = 0; i < flagAjax.length; i++) {
		if (id == flagAjax[i].id) {
			for (var j = 0; j < flagAjax[i].flags.length; j++) {
				printRow(flagAjax[i].flags[j].name, flagAjax[i].flags[j].active, idTable);
			}
		}
	}
}

// Pintem les files de les taules de les generacions i tambe pintem si estan actius o no els flags
function printRow(name, value, tableT) {
	var formRow;
	var icon;
	// Si el valor esta actiu, pintem una icona en verd, si no la pintem en vermell
	if (value) {
		icon = '<i class="fa fa-check fa-2x" style="color: green;"></i>';
	} else {
		icon = '<i class="fa fa-times fa-2x" style="color: red;"></i>';
	}
	formRow = '<tr><td>' + name + '</td><td>' + icon + '</td></tr>';
	// Afegim les files a la taula
	$("#" + tableT + " tbody").append(formRow);
}

//Ocultam el formulari quan no es mostra el modal
//$('#modalGen').on('hidden.bs.modal', function () {
//	$("#addForm").hide();
//});

// Pintem el modal per a afegir una nova generacio
$("#addGen").click(function(e) {
	$(".modal-body p").text("");
	$(".modal-title").text("Nom de la generació");
	$("#addForm").show();
	$(".modal-footer .btn-primary").remove();
});

// Afegim una nova generacio, a on demanem el nom de la generacio
$("#addForm").on("submit", function(e) {
	e.preventDefault();
	var name = $("#name").val();
	fireAjaxSubmit("/generation/insert", 'POST', {name: name});
	name = $("#name").val("");
	$('#modalGen').modal('hide');
	return false;
});

// Pintem la taula html dels flags, dins de les generacions
function printTable(idFlag, name, value, initDate, endDate, eTagFlag, tableT) {
	var formTable = "";
	formTable += '<form class="updateForm">';
	formTable += '<div class="form-row allGen" data-idFlag="'+ idFlag +'" data-eTag="' + eTagFlag + '">';
	formTable += '<div class="form-group col"><input type="text" value="' + name + '" name="name" id="name'+ idFlag +'" required /></div>';
	formTable += '<div class="form-group col"><input type="date" value="' + initDate + '" name="initDate" id="initDate'+ idFlag +'" required /></div>';
	formTable += '<div class="form-group col"><input type="date" value="' + endDate + '" name="endDate" id="endDate'+ idFlag +'" /></div>';
	formTable += '<div class="form-group col"><input type="text" value="' + value + '" name="value" id="value'+ idFlag +'" /></div>';
	formTable += '<div class="form-group col button"><button class="btn btn-success" onclick="updateRow(this)" title="Actualitzar" type="submit"><i class="fa fa-edit"></i> <span class="screen-btn">Update</span></button>';
	formTable += '<button class="btn btn-danger" onclick="deleteRow(this)" title="Esborrar" data-toggle="modal" data-target="#modalGen"><i class="fa fa-trash"></i> <span class="screen-btn">Delete</span></button></div>';
	formTable += '</div>';
	formTable += '</form>';
	$(tableT).append(formTable);
}

// Actualitzem una filera de la taula dels flags, dins de les generacions
function updateRow(row) {
	$(".updateForm").submit(function(e) {
		e.preventDefault();
		// Obtenim el valor del id, de la url
		var id = getUrlParameter('id');
		// Obtenim el valor del idFlag, de la filera del flag
		var idFlag = row.parentNode.parentNode.getAttribute("data-idFlag");
		// Obtenim el valor del eTag, de la filera del flag
		var eTagResp = '"'+row.parentNode.parentNode.getAttribute("data-eTag")+'"';
		// Obtenim el nom del flag
		var name = $("#name"+idFlag).val();
		// Obtenim la data de inici
		var initDate = $("#initDate"+idFlag).val();
		// Obtenim la data de fi
		var endDate = $("#endDate"+idFlag).val();
		// La data de inici ha de ser abans que la data de fi, si no, dona error
		if ((initDate > endDate) && (endDate != '')) {
			$(".updateForm").off("submit");
			$('#modalGen').modal('show'); 
			var titol = "Error amb les dates";
			var cos = "Data de fi ha de ser després de data d'inici";
			var boto = null;
			printModal(titol, cos, boto);
		} else {
			// Enviem la informacio de la actualitzacio al servidor
			var data = {id : id, idFlag : idFlag, name : name, value : $("#value"+idFlag).val(), initDate: initDate, endDate: endDate, eTagResp: eTagResp};
			fireAjaxSubmit("/generation/updateFlag", 'POST', data, eTag);
		}
	});
}

// Esborrem una filera de la taula dels flags, dins de les generacions
function deleteRow(row) {
	$(".updateForm").submit(function(e) {
		e.preventDefault();
		// Obtenim el valor del idFlag, de la filera del flag
		var idFlag = row.parentNode.parentNode.getAttribute("data-idFlag");
		// Obtenim el valor del id, de la url
		var id = getUrlParameter('id');
		// Obtenim el nom, per a pintar el modal, a on demem al usuari si la vol esborrar o no la generacio
		var nameR = $("#name"+idFlag).val();
		var titol = "Esborrar el flag " + nameR;
		var cos = "Vols eleminar el flag?";
		var boto = '<button class="btn btn-primary rmMod" href="#">Esborrar</button>';
		printModal(titol, cos, boto);
		$(".rmMod").click(function(e){
			// Enviem la peticio AJAX
			var data = {id : id, idFlag : idFlag};
			var eTagResp = eTag;
			fireAjaxSubmit("/generation/deleteFlag", 'POST', data, eTagResp);
		});
		$(".updateForm").off("submit");
	});
}

// Afegim una posicio a la taula dels flags, dins de les generacions
$("#addFormFlag").submit(function(e) {
	e.preventDefault();
	// Obtenim el valor del id, de la url
	var id = getUrlParameter('id');
	// Obtenim el nom del flag
	var name = $("#name").val();
	// Obtenim la data de inici
	var initDate = $("#initDate").val();
	// Obtenim la data de fi
	var endDate = $("#endDate").val();
	// Obtenim el valor del flag
	var value = $("#value").val();
	// La data de inici ha de ser abans que la data de fi, si no, dona error
	if ((initDate > endDate) && (endDate != '')) {
		$('#modalGen').modal('show'); 
		var titol = "Error amb les dates";
		var cos = "Data de fi ha de ser després de data d'inici";
		var boto = null;
		printModal(titol, cos, boto);
		return false;
	} else {
		// Enviem la informacio per a la insercio del nou flag al servidor
		var data = {id : id, name : name, initDate: initDate, endDate: endDate, value : value};
		fireAjaxSubmit("/generation/insertFlag", 'POST', data, eTag);
	}
});

// Esborrem una generacio donada
function remove(t) {
	// Obtenim el valor del id, de la url
	var idR = getUrlParameter('id');
	// Obtenim el nom de la generacio a esborrar
	var nameR = $("#rmGen span").text();
	// Si la generacio a esborrar, la volem esborrar de la plana principal
	if (idR == null){
		// Obtenim el nom i el id de la gneracio
		nameR = t.getAttribute("data-name");
		idR = t.getAttribute("data-id");
	} else {
		// Obtenim el valor del eTag, per a comprovar la concurrencia
		var eTagResp = eTag;
	}
	// Demanem al usuari si vol eleminar o no la generacion mitjancant un modal
	var titol = "Esborrar la generació de " + nameR;
	var cos = "Vols eleminar la generació?";
	var boto = '<button class="btn btn-primary rmMod" data-dismiss="modal" href="#">Esborrar</button>';
	printModal(titol, cos, boto);
	$(".rmMod").click(function(){
		fireAjaxSubmit("/generation/" + idR, 'DELETE', {}, eTagResp);
	});
}

// Pintem els camps de anys i mode
function printYM(value, id) {
	var formYM;
	// Afegim els valors de year i mode al desplegable
	formYM = '<option class="allGen" value="' + value + '">' + value + '</option>';
	$(id).append(formYM);
}

// Actualitzem el camp year en la base de dades
$("#year").change(function(){
	var year = $("#year").val();
	var mode = $("#mode").val();
	var id = getUrlParameter('id');
	var type = 'POST';
	var data = {id : id, year : year, mode : mode};
	fireAjaxSubmit("/generation/updateYM", type, data, eTag);
});
// Actualitzem el camp mode en la base de dades
$("#mode").change(function(){
	var year = $("#year").val();
	var mode = $("#mode").val();
	var id = getUrlParameter('id');
	var type = 'POST';
	var data = {id : id, year : year, mode : mode};
	fireAjaxSubmit("/generation/updateYM", type, data, eTag);
});
				
// Funcio per fer les cridades AJAX al servidor
function fireAjaxSubmit(url, type, data, eTagResp) {
	$.ajax({
		url: url,
		type: type,
		data: data,
		ifModified: true,
		beforeSend: function(request) {
			request.setRequestHeader("If-Match", eTagResp);
		}
	}).done(function( data, textStatus, jqXHR ) {
		if (jqXHR.getResponseHeader('content-length') == 0) {
			// Si la resposta es zero, vol dir, que se ha eliminat una generacio
			var URLactual = window.location.host;
			var URLdomain = window.location.protocol;
			window.location.replace(getAbsolutePath()+'index.html');
		} else {
			// Si no, pintem un requadre verd, per donar-li feedback al usuari
			$('#modalGen').modal('hide');
			done();
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
		// Si hi ha qualque error, obrim un modal i li mostrem la informacio al usuari
		if (jqXHR.status == 400) {
			$('#modalGen').modal('show');
			printModal('Petició incorrecta', 'Error ' + jqXHR.status, null);
		} else if (jqXHR.status == 404) {
			 window.location.replace('/flag/404.html');
		} else if (jqXHR.status == 409) {
		    $('#modalGen').modal('show');
			printModal('Conflicte amb les dades', 'Error ' + jqXHR.status, null);
		} else if (jqXHR.status == 412) {
			// Si hi ha un error de concurrencia, es crida a la funcio de concurrentError
			concurrentError();
		} else {
			$('#modalGen').modal('show');
			printModal('Error', 'Error ' + jqXHR.status, null);
		}
	});
}

// Funcio per a obtenir la ruta absoluta de la plana actual
function getAbsolutePath() {
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
}

// Actualitzem les dades pintades, mitjancant la funcio update, i mostrem el requadre verd per donar-li a l'usuari feedback que ha anat be l'operacio
function done(){
	// Demanem les dades de bell nou al servidor
	upDate();
	// Pintem un requadre verd durant un instant, per donar-li feedback al usuari
	$("#name").val("");
	$("#initDate").val("");
	$("#endDate").val("");
	$("#value").val("");
	$(".done").slideToggle("slow").delay(1000);
	$(".done").slideToggle("slow");
}

// Si es produeix un error per concurrencia, demanem a l'usuari si vol recarregar la plana al modal de Bootstrap
function concurrentError(){
	$('#modalGen').modal('show'); 
	var titol = "Un altre usuari ha actualitzat les dades";
	var cos = "Vol recarregar la pàgina?";
	var boto = '<button class="btn btn-primary" formtarget="_blank" data-dismiss="modal" href="#" onclick="location.reload()">Recarregar</button>';
	printModal(titol, cos, boto);
}

// Text i boto per a pintar el modal de logout
$("#logout").click(function(){
	var titol = 'Vols sortir?';
	var cos = 'Premi "Logout" si vol tancar la sessió.';
	var boto = '<button class="btn btn-primary" href="login.html">Logout</button>';
	printModal(titol, cos, boto);
});

// Pintem el modal amb els texts i boto passats per parametre
function printModal(titol, cos, boto) {
	$(".modal-title").text(titol);
	$(".modal-body").html(cos);
	$(".modal-footer .btn-primary").remove();
	$(".modal-footer").append(boto);
}

// Funcio per a fer les generacions responsive
function screenResponsive() {
	if ((document.getElementById("largura").offsetWidth > 930) && (document.getElementById("largura").offsetWidth < 1100)) {
		$(".screen-btn").addClass("nav-none");
	} else {
		$(".screen-btn").removeClass("nav-none");
	}
	$("#sidenavToggler").click(function() {
		if ((document.getElementById("largura").offsetWidth > 930) && (document.getElementById("largura").offsetWidth < 1100)) {
			$(".screen-btn").addClass("nav-none");
		} else {
			$(".screen-btn").removeClass("nav-none");
		}
	});
}
//Funcio per a fer les generacions responsive
$(window).resize(function () {
	if ((document.getElementById("largura").offsetWidth > 930) && (document.getElementById("largura").offsetWidth < 1100)) {
		$(".screen-btn").addClass("nav-none");
	} else {
		$(".screen-btn").removeClass("nav-none");
	}
});

// Obtenim el id de la pagina amb el url
var getUrlParameter = function getUrlParameter(sParam) {
	var sPageURL = decodeURIComponent(window.location.search.substring(1)), sURLVariables = sPageURL.split('&'), sParameterName, i;
	for (i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] === sParam) {
			return sParameterName[1] === undefined ? true : sParameterName[1];
		}
	}
};