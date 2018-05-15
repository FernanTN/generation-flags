// Demanam les dades al servidor i les pintam
$(document).ready(function() {
	$.get("/generation/", function(xml) {
		$(xml).each(function() {
			var name = $(this).attr('name');
			var id = $(this).attr('id');
			printMenu(name, id);
			printTable(name, id);
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
});

// Actualitzam les dades i les pintam
function upDate() {
	$(".allGen").remove();
	$.get("/generation/", function(xml) {
		$(xml).each(function() {
			var name = $(this).attr('name');
			var id = $(this).attr('id');
			printMenu(name, id);
			printTable(name, id);
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

// Pintam la taula
function printTable(name, id) {
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

// Afegir nova página al menú
function printMenu(name, id) {
	var formMenu;
	var inLletra = name.substr(0,1);
	formMenu = '<li class="nav-item '+ id +' allGen" data-toggle="tooltip" data-placement="right"><a class="nav-link" href="generation-study.html?id=' + id + '"><span class="inLletra nav-none">' + inLletra + '</span><span class="nav-link-text">' + name + '</span></a></li>';
	$("#menuGeneration").append(formMenu);
}

// Petició AJAX per afegir una nova generació o esborrar una generació
function fire_ajax_submit(url, type, data) {
	$.ajax({
		url: url,
		type: type,
		data: data
	}).done(function() {
		done();
	}).fail( function( jqXHR, textStatus, errorThrown ) {
		if (jqXHR.status === 0) {
			alert('Not connect: Verify Network.');
		} else if (jqXHR.status == 400) {
		    alert('Bad Request.');
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

// Modificam els noms del menú
$("#sidenavToggler").click(function(){
    $(".inLletra").toggleClass("nav-none");
});

// Mostram un quadre verd quan l'acció ha anat bé
function done(){
	$(".done").slideToggle("slow").delay(1000);
	$(".done").slideToggle("slow");
	upDate();
}

// Opcions del pop-up de logout
$("#logout").click(function(){
	var titol = 'Vols sortir?';
	var cos = 'Premi "Logout" si vol tancar la sessió.';
	var boto = '<button class="btn btn-primary" href="login.html">Logout</button>';
	printModal(titol, cos, boto);
});

// Pintar el modal
function printModal (titol, cos, boto) {
	$(".modal-title").text(titol);
	$(".modal-body p").text(cos);
	$(".modal-footer .btn-primary").remove();
	$(".modal-footer").append(boto);
}