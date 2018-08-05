package com.flags.FlagsEstudis.repository;

import java.util.Collection;

import org.springframework.data.repository.CrudRepository;
import com.flags.FlagsEstudis.model.Generation;

public interface GenerationRepository extends CrudRepository<Generation, String>{
	@Override
	Collection<Generation> findAll();
	// Cerca una generacio per nom
	Generation findByName(String name);
}
