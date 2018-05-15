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

	@RequestMapping
	public ResponseEntity<Collection<Generation>> showAll() {
		return new ResponseEntity<>(repository.findAll(), HttpStatus.OK);
	}

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

	@RequestMapping(path = "/{id}", method = RequestMethod.GET)
	public ResponseEntity<Generation> showOne(@PathVariable(name = "id") String id) {
		Generation generation = repository.findOne(id);
		if (generation == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
		return ResponseEntity.ok().eTag("\"" + generation.getVersion() + "\"").body(generation);
	}

	@RequestMapping(path = "/name/{id}", method = RequestMethod.GET)
	public ResponseEntity<Generation> showName(@PathVariable(name = "id") String id) {
		Generation generation = repository.findByName(id);
		if (generation == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
		return ResponseEntity.status(HttpStatus.OK).eTag("\"" + generation.getVersion() + "\"").body(generation);
	}

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

	@RequestMapping(path = "/insertFlag", method = RequestMethod.POST)
	public ResponseEntity<Generation> insertFlag(WebRequest request, @Valid @RequestBody @RequestParam(name = "id") String id,
			@RequestParam(name = "name") String name, @RequestParam(name = "initDate") String initDateS,
			@RequestParam(name = "endDate") String endDateS, @RequestParam(name = "value") String value) {
		Generation generation = repository.findOne(id);
		// log.info("Hemos llamado a esto: {}", name, endDateS);
		// Si falten els paràmetres
		if (generation == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
		String ifMatchValue = request.getHeader("If-Match");
		if (ifMatchValue.equals("")) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
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
			//ñapa para actualizar el campo version
			generation.setUpD(generation.getUpD()+1);
			repository.save(generation);
			log.info("Hemos llamado a esto : {}", generation.getVersion());
			return ResponseEntity.ok().eTag("\"" + generation.getVersion() + "\"").body(generation);
//			return new ResponseEntity<>(generation, HttpStatus.OK);
		} catch (OptimisticLockingFailureException ex) {
			return ResponseEntity.status(HttpStatus.CONFLICT).build();
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
	}

	@RequestMapping(path = "/updateFlag", method = RequestMethod.POST)
	public ResponseEntity<Generation> updateFlag(WebRequest request, @Valid @RequestBody @RequestParam(name = "id") String id,
			@RequestParam(name = "idFlag") String idFlag, @RequestParam(name = "name") String name,
			@RequestParam(name = "value") String value, @RequestParam(name = "initDate") String initDateS,
			@RequestParam(name = "endDate") String endDateS, @RequestParam(name = "eTagResp") String eTagFlag) {
		Generation generation = repository.findOne(id);
		GenerationFlag flag = repositoryFlag.findOne(idFlag);
		if (flag == null) {
//			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).build();
		}
		String ifMatchValue = request.getHeader("If-Match");
		if (ifMatchValue.equals("")) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
		if (!eTagFlag.equals(flag.toString()) || !ifMatchValue.equals("\"" + generation.getVersion() + "\"")) {
			return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).build();
		}
		try {
			LocalDate initDate = LocalDate.parse(initDateS);
			LocalDate endDate;
			if (endDateS != "") endDate = LocalDate.parse(endDateS);
			else endDate = null;
			flag.setName(name);
			flag.setValue(value);
			flag.setInitDate(initDate);
			flag.setEndDate(endDate);
			repositoryFlag.save(flag);
			//ñapa para actualizar el campo version
			generation.setUpD(generation.getUpD()+1);
			repository.save(generation);
			log.info("Hemos llamado a esto : {}", generation.getVersion());
//			return new ResponseEntity<>(generation, HttpStatus.OK);
			return ResponseEntity.ok().eTag("\"" + generation.getVersion() + "\"").body(generation);
		} catch (OptimisticLockingFailureException ex) {
			return ResponseEntity.status(HttpStatus.CONFLICT).build();
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
	}

	@RequestMapping(path = "/deleteFlag", method = RequestMethod.POST)
	public ResponseEntity<Generation> deleteFlag(WebRequest request, @Valid @RequestBody @RequestParam(name = "id") String id,
			@RequestParam(name = "idFlag") String idFlag) {
//		log.info("Hemos llamado a esto : {}", idFlag);
		Generation generation = repository.findOne(id);
		GenerationFlag flag = repositoryFlag.findOne(idFlag);
		if (flag == null) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		String ifMatchValue = request.getHeader("If-Match");
		if (ifMatchValue.equals("")) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
		if (!ifMatchValue.equals("\"" + generation.getVersion() + "\"")) {
			return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).build();
		}
		try {
			repositoryFlag.delete(flag);
			//ñapa para actualizar el campo version
			generation.setUpD(generation.getUpD()+1);
			repository.save(generation);
			return ResponseEntity.ok().eTag("\"" + generation.getVersion() + "\"").body(generation);
//			return new ResponseEntity<>(generation, HttpStatus.OK);
		} catch (OptimisticLockingFailureException ex) {
			return ResponseEntity.status(HttpStatus.CONFLICT).build();
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
	}

	@RequestMapping(path = "/updateYM", method = RequestMethod.POST)
	public ResponseEntity<Generation> updateYM(WebRequest request,
			@Valid @RequestBody @RequestParam(name = "id") String id, @RequestParam(name = "year") String year,
			@RequestParam(name = "mode") String mode) {
		Generation generation = repository.findOne(id);
		if (generation == null) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		String ifMatchValue = request.getHeader("If-Match");
		if (ifMatchValue.equals("")) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
		if (!ifMatchValue.equals("\"" + generation.getVersion() + "\"")) {
			return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).build();
		}
		try {
			if (year.equals("")) year = "-";
			if (mode.equals("")) mode = "-";
//			log.info("Hemos llamado a esto : {}", generation.getVersion());
			generation.setYear(year);
			generation.setMode(mode);
			repository.save(generation);
//			return new ResponseEntity<>(generation, HttpStatus.OK);
			return ResponseEntity.ok().eTag("\"" + generation.getVersion() + "\"").body(generation);
		} catch (OptimisticLockingFailureException ex) {
			return ResponseEntity.status(HttpStatus.CONFLICT).build();
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
	}
}