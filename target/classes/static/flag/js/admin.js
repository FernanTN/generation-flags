var eTag;
$(document).ready(function() {
// Carregam el fitxer xml de generacions
	var name;
	var id = getUrlParameter('id');
	if (id!=null){
		var url = '/generation/'+id;
		// Cridada AJAX per a obtenir el camp eTag
		$.ajax({
			url: url,
			type: 'HEAD',
			dataType : 'xml',
			success: function( data, textStatus, jqXHR ) {
				eTag= jqXHR.getResponseHeader('ETag');
			}
		});
	}
// Llegim del fitxer xml dels anys i modes
	$.get("/year-mode/", function(xml) {
		$(xml).each(function() {
			var years = $(this).attr('years');
			var mode = $(this).attr('mode');
			years.forEach( function(value) {
				printYM(value, "#year");
			});
			mode.forEach( function(value) {
				printYM(value, "#mode");
			});
		});
	}).fail( function( jqXHR, textStatus, errorThrown ) {
		if (jqXHR.status === 0) {
			alert('Not connect: Verify Network.');
		} else if (jqXHR.status == 400) {
		    alert('Petició incorrecta');
		} else if (jqXHR.status == 404) {
			 window.location.replace('/flag/404.html');
		} else if (jqXHR.status == 409) {
		    alert('Conflicte amb les dades');
		} else if (jqXHR.status == 412) {
			concurrentError();
		} else if (jqXHR.status == 500) {
		    alert('Internal Server Error [500].');
		} else if (textStatus === 'parsererror') {
		    alert('Requested JSON parse failed.');
		} else if (textStatus === 'timeout') {
			alert('Time out error.');
		} else if (textStatus === 'abort') {
			alert('Ajax request aborted.');
		} else {
			alert('Uncaught Error: ' + jqXHR.responseText);
		}
	});
// Llegim del fitxer xml de les generacions
	$.get("/generation/", function(xml) {
		$(xml).each(function() {
			var name = $(this).attr('name');
			var id = $(this).attr('id');
			printMenu(name, id);
			printTableHome(name, id);
		});
	}).fail( function( jqXHR, textStatus, errorThrown ) {
		if (jqXHR.status === 0) {
			alert('Not connect: Verify Network.');
		} else if (jqXHR.status == 404) {
			 window.location.replace('/flag/404.html');
		} else if (jqXHR.status == 500) {
		    alert('Internal Server Error [500].');
		} else if (textStatus === 'parsererror') {
		    alert('Requested JSON parse failed.');
		} else if (textStatus === 'timeout') {
			alert('Time out error.');
		} else if (textStatus === 'abort') {
			alert('Ajax request aborted.');
		} else {
			alert('Uncaught Error: ' + jqXHR.responseText);
		}
	});
//	$.get('/generation/'+id, function(xml, textStatus, jqXHR) {
	if (id!=null){
	// Llegim del fitxer xml per pintar les files de la taula, l'any i mode i el nom de la generacio
		$.ajax({
			url: url,
			type: 'GET',
			dataType : 'xml',
			success: function(xml, textStatus, jqXHR) {
				$("#year").val($(xml).find("generation").attr('year'));
				$("#mode").val($(xml).find("generation").attr('mode'));
				var name = $(xml).find("generation").attr('name');
				document.title = name;
				$(".breadcrumb .active").append(name);
				$(".col-12 span").append(name);
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
					printTable(idFlag, name, value, initDate, endDate, eTagFlag, "#dataTable");
				});
				screenResponsive();
			}
		}).fail( function( jqXHR, textStatus, errorThrown ) {
			if (jqXHR.status === 0) {
				alert('Not connect: Verify Network.');
			} else if (jqXHR.status == 404) {
				 window.location.replace('/flag/404.html');
			} else if (jqXHR.status == 500) {
			    alert('Internal Server Error [500].');
			} else if (textStatus === 'parsererror') {
			    alert('Requested JSON parse failed.');
			} else if (textStatus === 'timeout') {
				alert('Time out error.');
			} else if (textStatus === 'abort') {
				alert('Ajax request aborted.');
			} else {
				alert('Uncaught Error: ' + jqXHR.responseText);
			}
		});
	}
});

// Actualitzam les dades i les pintam
function upDate(data) {
	var id = getUrlParameter('id');
	if (id!=null){
		var url = '/generation/'+id+'.xml';
		$.ajax({
			url: url,
			type: 'HEAD',
			dataType : 'xml',
			success: function( data, textStatus, jqXHR ) {
				eTag = jqXHR.getResponseHeader('ETag');
			}
		});
	}
	$(".allGen").remove();
	$.get("/year-mode/", function(xml) {
		$(xml).each(function() {
			var years = $(this).attr('years');
			var mode = $(this).attr('mode');
			years.forEach( function(value) {
				printYM(value, "#year");
			});
			mode.forEach( function(value) {
				printYM(value, "#mode");
			});
		});
	}).fail( function( jqXHR, textStatus, errorThrown ) {
		if (jqXHR.status === 0) {
			alert('Not connect: Verify Network.');
		} else if (jqXHR.status == 404) {
			 window.location.replace('/flag/404.html');
		} else if (jqXHR.status == 500) {
		    alert('Internal Server Error [500].');
		} else if (textStatus === 'parsererror') {
		    alert('Requested JSON parse failed.');
		} else if (textStatus === 'timeout') {
			alert('Time out error.');
		} else if (textStatus === 'abort') {
			alert('Ajax request aborted.');
		} else {
			alert('Uncaught Error: ' + jqXHR.responseText);
		}
	});
	if (id!=null){
	// Llegim del fitxer xml per pintar les files
		$.get(url, function(xml) {
			$("#year").val($(xml).find("generation").attr('year'));
			$("#mode").val($(xml).find("generation").attr('mode'));
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
				printTable(idFlag, name, value, initDate, endDate, eTagFlag, "#dataTable");
			});
			screenResponsive();
		}).fail( function( jqXHR, textStatus, errorThrown ) {
			if (jqXHR.status === 0) {
				alert('Not connect: Verify Network.');
			} else if (jqXHR.status == 404) {
				 window.location.replace('/flag/404.html');
			} else if (jqXHR.status == 500) {
			    alert('Internal Server Error [500].');
			} else if (textStatus === 'parsererror') {
			    alert('Requested JSON parse failed.');
			} else if (textStatus === 'timeout') {
				alert('Time out error.');
			} else if (textStatus === 'abort') {
				alert('Ajax request aborted.');
			} else {
				alert('Uncaught Error: ' + jqXHR.responseText);
			}
		});
	}
	
	$.get("/generation/", function(xml) {
		$(xml).each(function() {
			var name = $(this).attr('name');
			var id = $(this).attr('id');
			printMenu(name, id);
			printTableHome(name, id);
		});
	}).fail( function( jqXHR, textStatus, errorThrown ) {
		if (jqXHR.status === 0) {
			alert('Not connect: Verify Network.');
		} else if (jqXHR.status == 404) {
			 window.location.replace('/flag/404.html');
		} else if (jqXHR.status == 500) {
		    alert('Internal Server Error [500].');
		} else if (textStatus === 'parsererror') {
		    alert('Requested JSON parse failed.');
		} else if (textStatus === 'timeout') {
			alert('Time out error.');
		} else if (textStatus === 'abort') {
			alert('Ajax request aborted.');
		} else {
			alert('Uncaught Error: ' + jqXHR.responseText);
		}
	});
}

// Pintam el menú
function printMenu(name, id) {
	var formMenu;
	var inLletra = name.substr(0,1);
	formMenu = '<li class="nav-item '+ id +' allGen" data-toggle="tooltip" data-placement="right"><a class="nav-link" href="generation-study.html?id=' + id + '"><span class="inLletra nav-none">' + inLletra + '</span><span class="nav-link-text">' + name + '</span></a></li>';
	// $("#id").val(id);
	// formMenu = '<li class="nav-item" data-toggle="tooltip" data-placement="right"><a class="nav-link" href="generation-study.html?id=' + id + '"><span class="inLletra nav-none">' + inLletra + '</span><span class="nav-link-text">' + name + '</span></a></li>';
	$("#menuGeneration").append(formMenu);
}

// Pintam els camps de anys i mode
function printYM(value, id) {
	var formYM;
	formYM = '<option class="allGen" value="' + value + '">' + value + '</option>';
	$(id).append(formYM);
}

// Pintam la taula de home
function printTableHome(name, id) {
	var url;
	var idTable = "table" + name;
	var formTable = "";
	formTable += '<div class="col-md-6 '+ id +' allGen"><h2>';
	formTable += '<a class="estudi" href="generation-study.html?id=' + id + '"title="Editar ' + name + '">' + name + '	<i class="fa fa-edit"></i></a>';
	formTable += ' <a href="#" class="rmGInd" data-toggle="modal" data-target="#modalGen" data-name="' + name + '" data-id="' + id + '" onclick="remove(this)" title="Esborrar ' + name + '"><i class="fa fa-trash"></i></a>';
	formTable += '</h2><div class="table-responsive"><table class="table" id="' + idTable;
	formTable += '" width="100%" cellspacing="0"><thead><tr><th class="col-md-5">Nom</th><th class="col-md-1">Valor</th></tr></thead><tbody></tbody></table></div></div>';
	$("#genTables").append(formTable);
	// Emplenam les taules
	url = '/generation/' + id;
	$.get(url, function(xml) {
		var flags = $(xml).attr('flags');
		flags.map(function(elem) {
			var name = $(elem).attr('name');
			var value = $(elem).attr('active');
			printRow(name, value, idTable);
		});
	}).fail( function( jqXHR, textStatus, errorThrown ) {
		if (jqXHR.status === 0) {
			alert('Not connect: Verify Network.');
		} else if (jqXHR.status == 404) {
			 window.location.replace('/flag/404.html');
		} else if (jqXHR.status == 500) {
		    alert('Internal Server Error [500].');
		} else if (textStatus === 'parsererror') {
		    alert('Requested JSON parse failed.');
		} else if (textStatus === 'timeout') {
			alert('Time out error.');
		} else if (textStatus === 'abort') {
			alert('Ajax request aborted.');
		} else {
			alert('Uncaught Error: ' + jqXHR.responseText);
		}
	});
}


// Pintam les files de les taules al html
function printRow(name, value, tableT) {
	var formRow;
	var icon;
	if (value) {
		icon = '<i class="fa fa-check fa-2x" style="color: green;"></i>';
	} else {
		icon = '<i class="fa fa-times fa-2x" style="color: red;"></i>';
	}
	formRow = '<tr><td>' + name + '</td><td>' + icon + '</td></tr>';
	$("#" + tableT + " tbody").append(formRow);
}

//Ocultam el formulari quan no es mostra el modal
$('#modalGen').on('hidden.bs.modal', function () {
	$("#addForm").hide();
});

// Afegir nova página al menú
$("#addGen").click(function(e) {
	$(".modal-body p").text("");
	$(".modal-title").text("Nom de la generació");
	$("#addForm").show();
	$(".modal-footer .btn-primary").remove();
});

//quitar boton y poner el código del modal en el código html
$("#addForm").on("submit", function(e) {
	e.preventDefault();
	var url = "/generation/insert";
	var name = $("#name").val();
	var data = {name: name};
	var type = 'POST';
	fire_ajax_submit(url, type, data);
	name = $("#name").val("");
	$('#modalGen').modal('hide');
	return false;
});

// Pintam les taules al html
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

// Actualitzar files de la taula
function updateRow(row) {
	$(".updateForm").submit(function(e) {
		e.preventDefault();
		var id = getUrlParameter('id');
		var i = row.parentNode.parentNode.getAttribute("data-idFlag");
		var eTagResp = '"'+row.parentNode.parentNode.getAttribute("data-eTag")+'"';
		var name = $("#name"+i).val();
		var initDate = $("#initDate"+i).val();
		var endDate = $("#endDate"+i).val();
		if ((initDate > endDate) && (endDate != '')) {
			$(".updateForm").off("submit");
			$('#modalGen').modal('show'); 
			var titol = "Error amb les dates";
			var cos = "Data de fi ha de ser després de data d'inici";
			var boto = null;
			printModal(titol, cos, boto);
		} else {
			var data = {id : id, idFlag : i, name : name, value : $("#value"+i).val(), initDate: initDate, endDate: endDate, eTagResp: eTagResp};
			fire_ajax_submit("/generation/updateFlag", 'POST', data, eTag);
		}
	});
}

// Esborrar files de la taula
function deleteRow(row) {
	$(".updateForm").submit(function(e) {
		e.preventDefault();
		var i = row.parentNode.parentNode.getAttribute("data-idFlag");
		var id = getUrlParameter('id');
		var nameR = $("#name"+i).val();
		var titol = "Esborrar el flag " + nameR;
		var cos = "Vols eleminar el flag?";
		var boto = '<button class="btn btn-primary rmMod" href="#">Esborrar</button>';
		printModal(titol, cos, boto);
		$(".rmMod").click(function(e){
			var data = {id : id, idFlag : i};
			var eTagResp = eTag;
			fire_ajax_submit("/generation/deleteFlag", 'POST', data, eTagResp);
		});
		$(".updateForm").off("submit");
	});
}

// Afegir una posició en la taula
$("#addFormFlag").submit(function(e) {
	e.preventDefault();
	var id = getUrlParameter('id');
	var name = $("#name").val();
	var initDate = $("#initDate").val();
	var endDate = $("#endDate").val();
	var value = $("#value").val();
	if ((initDate > endDate) && (endDate != '')) {
		$('#modalGen').modal('show'); 
		var titol = "Error amb les dates";
		var cos = "Data de fi ha de ser després de data d'inici";
		var boto = null;
		printModal(titol, cos, boto);
		return false;
	} else {
		var data = {id : id, name : name, initDate: initDate, endDate: endDate, value : value};
		var eTagResp = eTag;
		fire_ajax_submit("/generation/insertFlag", 'POST', data, eTagResp);
	}
});

// Obtenim el id de la pàgina
var getUrlParameter = function getUrlParameter(sParam) {
	var sPageURL = decodeURIComponent(window.location.search.substring(1)), sURLVariables = sPageURL.split('&'), sParameterName, i;
	for (i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] === sParam) {
			return sParameterName[1] === undefined ? true : sParameterName[1];
		}
	}
};

// Esborrar generació
$("#rmGen").click(function() {
	var id = getUrlParameter('id');
	var url = "/generation/" + id;
	var data = {};
	var nameR = $("#rmGen span").text();
	var titol = "Esborrar la generació de " + nameR;
	var cos = "Vols eleminar la generació?";
	var boto = '<button class="btn btn-primary rmMod" data-dismiss="modal" href="#">Esborrar</button>';
	printModal(titol, cos, boto);
	$(".rmMod").click(function(){
		var eTagResp = eTag;
		fire_ajax_submit(url, 'DELETE', data, eTagResp);
	});
});

// Esborrar generació
function remove(t) {
	var nameR = t.getAttribute("data-name");
	var idR = t.getAttribute("data-id");
	console.log(idR);
	var url = "/generation/" + idR;
	var type = 'DELETE';
	var data = {};
	
	var titol = "Esborrar la generació de " + nameR;
	var cos = "Vols eleminar la generació?";
	var boto = '<button class="btn btn-primary rmMod" data-dismiss="modal" href="#">Esborrar</button>';
	printModal(titol, cos, boto);
	$(".rmMod").click(function(){
		fire_ajax_submit(url, type, data);
	});
}

// Actualizam els camps year i mode en la base de dades
$("#year").change(function(){
	var year = $("#year").val();
	var mode = $("#mode").val();
	var id = getUrlParameter('id');
	var type = 'POST';
	var data = {id : id, year : year, mode : mode};
	var eTagResp = eTag;
	fire_ajax_submit("/generation/updateYM", type, data, eTagResp);
});

$("#mode").change(function(){
	var year = $("#year").val();
	var mode = $("#mode").val();
	var id = getUrlParameter('id');
	var type = 'POST';
	var data = {id : id, year : year, mode : mode};
	var eTagResp = eTag;
	fire_ajax_submit("/generation/updateYM", type, data, eTagResp);
});
				
// Afegir/actualitzar/esborrar un flag a la base de dades, actualitzar els campl years i mode i esborrar la generacio 
function fire_ajax_submit(url, type, data, eTagResp) {
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
			window.location.replace('http://localhost:8080/');
		} else {
			$('#modalGen').modal('hide');
			done();
		}
	}).fail( function( jqXHR, textStatus, errorThrown ) {
		if (jqXHR.status === 0) {
			alert('Not connect: Verify Network.');
		} else if (jqXHR.status == 400) {
		    alert('Petició incorrecta');
		} else if (jqXHR.status == 404) {
			 window.location.replace('/flag/404.html');
		} else if (jqXHR.status == 409) {
		    alert('Conflicte amb les dades');
		} else if (jqXHR.status == 412) {
			concurrentError();
		} else if (jqXHR.status == 500) {
		    alert('Internal Server Error [500].');
		} else if (textStatus === 'parsererror') {
		    alert('Requested JSON parse failed.');
		} else if (textStatus === 'timeout') {
			alert('Time out error.');
		} else if (textStatus === 'abort') {
			alert('Ajax request aborted.');
		} else {
			alert('Uncaught Error: ' + jqXHR.responseText);
		}
	});
}

// Executam el modal per a recarregar la pagina
function concurrentError(){
	$('#modalGen').modal('show'); 
	var titol = "Un altre usuari ha actualitzat les dades";
	var cos = "Vol recarregar la mateixa finestra o una nova?";
	var boto = '<button class="btn btn-primary" formtarget="_blank" data-dismiss="modal" href="#" onclick="location.reload()">Recarregar</button>';
	printModal(titol, cos, boto);
}

// Modificam els noms del menú
$("#sidenavToggler").click(function(){
    $(".inLletra").toggleClass("nav-none");
});

// Mostram un quadre verd quan l'acció ha anat bé
function done(){
	upDate();
	$("#name").val("");
	$("#initDate").val("");
	$("#endDate").val("");
	$("#value").val("");
	$(".done").slideToggle("slow").delay(1000);
	$(".done").slideToggle("slow");
}

//Opcions del pop-up de logout
$("#logout").click(function(){
	var titol = 'Vols sortir?';
	var cos = 'Premi "Logout" si vol tancar la sessió.';
	var boto = '<button class="btn btn-primary" href="login.html">Logout</button>';
	printModal(titol, cos, boto);
});

// Pintar el modal
function printModal(titol, cos, boto) {
	$(".modal-title").text(titol);
	$(".modal-body").html(cos);
	$(".modal-footer .btn-primary").remove();
	$(".modal-footer").append(boto);
}

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
$(window).resize(function () {
	if ((document.getElementById("largura").offsetWidth > 930) && (document.getElementById("largura").offsetWidth < 1100)) {
		$(".screen-btn").addClass("nav-none");
	} else {
		$(".screen-btn").removeClass("nav-none");
	}
});