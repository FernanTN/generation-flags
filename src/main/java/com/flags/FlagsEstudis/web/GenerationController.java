package com.flags.FlagsEstudis.web;

import java.time.LocalDate;
import java.util.Collection;

import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.context.request.WebRequest;

import com.flags.FlagsEstudis.model.Generation;
import com.flags.FlagsEstudis.model.GenerationFlag;
import com.flags.FlagsEstudis.repository.GenerationRepository;
import com.flags.FlagsEstudis.repository.GenerationFlagsRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.OptimisticLockingFailureException;

import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/generation")
@Slf4j
public class GenerationController {

	@Autowired
	GenerationRepository repository;
	@Autowired
	GenerationFlagsRepository repositoryFlag;

	// Metode per recuperar tot el que hi ha a la base de dades
	@RequestMapping
	public ResponseEntity<Collection<Generation>> showAll() {
		return new ResponseEntity<>(repository.findAll(), HttpStatus.OK);
	}

	// Metode per inserir una nova generacio
	@RequestMapping(path = "/insert", method = RequestMethod.POST)
	public ResponseEntity<Generation> insert(@Valid @RequestBody @RequestParam(name = "name") String name) {
		Generation generation = new Generation(name, null, null, null);
		try {
			repository.save(generation);
			return new ResponseEntity<>(generation, HttpStatus.OK);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
	}

	// Metode per recuperar una generacio per un id donat
	@RequestMapping(path = "/{id}", method = RequestMethod.GET)
	public ResponseEntity<Generation> showOne(@PathVariable(name = "id") String id) {
		Generation generation = repository.findOne(id);
		if (generation == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
		return ResponseEntity.ok().eTag("\"" + generation.getVersion() + "\"").body(generation);
	}

	// Metode per recuperar una generacio per un nom donat
	@RequestMapping(path = "/name/{id}", method = RequestMethod.GET)
	public ResponseEntity<Generation> showName(@PathVariable(name = "id") String id) {
		Generation generation = repository.findByName(id);
		if (generation == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
		return ResponseEntity.status(HttpStatus.OK).eTag("\"" + generation.getVersion() + "\"").body(generation);
	}

	// Metode per eliminar una generacio per un id donat
	@RequestMapping(path = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Generation> deleteOne(@PathVariable(name = "id") String id) {
		Generation generation = repository.findOne(id);
		log.info("Hemos llamado a esto: {}", generation);
		if (generation == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
		repository.delete(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	// Metode per inserir un nou flag de una generacio donada
	@RequestMapping(path = "/insertFlag", method = RequestMethod.POST)
	public ResponseEntity<Generation> insertFlag(WebRequest request, @Valid @RequestBody @RequestParam(name = "id") String id,
			@RequestParam(name = "name") String name, @RequestParam(name = "initDate") String initDateS,
			@RequestParam(name = "endDate") String endDateS, @RequestParam(name = "value") String value) {
		Generation generation = repository.findOne(id);
		// Si falten els paràmetres
		if (generation == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
		// Si el camp eTag esta buit, enviam bad_request
		String ifMatchValue = request.getHeader("If-Match");
		if (ifMatchValue.equals("")) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
		// Comprovem si ha canviat la versio de les dades, si ha canviat enviem el estatus ha fallat
		if (!ifMatchValue.equals("\"" + generation.getVersion() + "\"")) {
			return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).build();
		}
		try {
			LocalDate initDate = LocalDate.parse(initDateS);
			LocalDate endDate;
			if (endDateS != "") endDate = LocalDate.parse(endDateS);
			else endDate = null;
			GenerationFlag flag = new GenerationFlag(name, initDate, endDate, null, generation);
			repositoryFlag.save(flag);
			// Actulitzem el atribut upD
			generation.setUpD(generation.getUpD()+1);
			repository.save(generation);
			// Enviem el eTag i la informacio
			return ResponseEntity.ok().eTag("\"" + generation.getVersion() + "\"").body(generation);
		} catch (OptimisticLockingFailureException ex) {
			// Si es produeix un error OptimisticLockException, responem amb un 409
			return ResponseEntity.status(HttpStatus.CONFLICT).build();
		} catch (Exception e) {
			// Si es produix un error, responem bad_request
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
	}

	// Metode per actualitzar els flags de una generacio donada
	@RequestMapping(path = "/updateFlag", method = RequestMethod.POST)
	public ResponseEntity<Generation> updateFlag(WebRequest request, @Valid @RequestBody @RequestParam(name = "id") String id,
			@RequestParam(name = "idFlag") String idFlag, @RequestParam(name = "name") String name,
			@RequestParam(name = "value") String value, @RequestParam(name = "initDate") String initDateS,
			@RequestParam(name = "endDate") String endDateS, @RequestParam(name = "eTagResp") String eTagFlag) {
		Generation generation = repository.findOne(id);
		GenerationFlag flag = repositoryFlag.findOne(idFlag);
		if (flag == null) {
			return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).build();
		}
		// Si el camp eTag esta buit, enviam bad_request
		String ifMatchValue = request.getHeader("If-Match");
		if (ifMatchValue.equals("")) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
		// Comprovem si ha canviat la versio de les dades, si ha canviat enviem el estatus ha fallat
		if (!eTagFlag.equals("\"" + flag.getVersion() + "\"") || !ifMatchValue.equals("\"" + generation.getVersion() + "\"")) {
			return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).build();
		}
		try {
			LocalDate initDate = LocalDate.parse(initDateS);
			LocalDate endDate;
			// Si el camp enDate que rebem a la peticio esta buit, el posem a null
			if (endDateS != "") endDate = LocalDate.parse(endDateS);
			else endDate = null;
			flag.setName(name);
			flag.setValue(value);
			flag.setInitDate(initDate);
			flag.setEndDate(endDate);
			repositoryFlag.save(flag);
			// Actulitzem el atribut upD
			generation.setUpD(generation.getUpD()+1);
			repository.save(generation);
			// Enviem el eTag i la informacio
			return ResponseEntity.ok().eTag("\"" + generation.getVersion() + "\"").body(generation);
		} catch (OptimisticLockingFailureException ex) {
			// Si es produeix un error OptimisticLockException, responem amb un 409
			return ResponseEntity.status(HttpStatus.CONFLICT).build();
		} catch (Exception e) {
			// Si es produix un error, responem bad_request
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
	}

	// Metode per esborrar un flag de una generacio donada
	@RequestMapping(path = "/deleteFlag", method = RequestMethod.POST)
	public ResponseEntity<Generation> deleteFlag(WebRequest request, @Valid @RequestBody @RequestParam(name = "id") String id,
			@RequestParam(name = "idFlag") String idFlag) {
		Generation generation = repository.findOne(id);
		GenerationFlag flag = repositoryFlag.findOne(idFlag);
		if (flag == null) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		// Si el camp eTag esta buit, enviam bad_request
		String ifMatchValue = request.getHeader("If-Match");
		if (ifMatchValue.equals("")) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
		// Comprovem si ha canviat la versio de les dades, si ha canviat enviem el estatus ha fallat
		if (!ifMatchValue.equals("\"" + generation.getVersion() + "\"")) {
			return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).build();
		}
		try {
			repositoryFlag.delete(flag);
			// Actulitzem el atribut upD
			generation.setUpD(generation.getUpD()+1);
			repository.save(generation);
			// Enviem el eTag i la informacio
			return ResponseEntity.ok().eTag("\"" + generation.getVersion() + "\"").body(generation);
		} catch (OptimisticLockingFailureException ex) {
			// Si es produeix un error OptimisticLockException, responem amb un 409
			return ResponseEntity.status(HttpStatus.CONFLICT).build();
		} catch (Exception e) {
			// Si es produix un error, responem bad_request
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
	}

	// Metode per actualitzar els valors de any i mode a la base de dades
	@RequestMapping(path = "/updateYM", method = RequestMethod.POST)
	public ResponseEntity<Generation> updateYM(WebRequest request,
			@Valid @RequestBody @RequestParam(name = "id") String id, @RequestParam(name = "year") String year,
			@RequestParam(name = "mode") String mode) {
		Generation generation = repository.findOne(id);
		if (generation == null) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		// Si el camp eTag esta buit, enviam bad_request
		String ifMatchValue = request.getHeader("If-Match");
		if (ifMatchValue.equals("")) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
		// Comprovem si ha canviat la versio de les dades, si ha canviat enviem el estatus ha fallat
		if (!ifMatchValue.equals("\"" + generation.getVersion() + "\"")) {
			return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).build();
		}
		try {
			// A la base de dades no es pot guardar cap valor buit
			if (year.equals("")) year = "-";
			if (mode.equals("")) mode = "-";
			generation.setYear(year);
			generation.setMode(mode);
			repository.save(generation);
			// Enviem el eTag i la informacio
			return ResponseEntity.ok().eTag("\"" + generation.getVersion() + "\"").body(generation);
		} catch (OptimisticLockingFailureException ex) {
			// Si es produeix un error OptimisticLockException, responem amb un 409
			return ResponseEntity.status(HttpStatus.CONFLICT).build();
		} catch (Exception e) {
			// Si es produix un error, responem bad_request
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
	}
}