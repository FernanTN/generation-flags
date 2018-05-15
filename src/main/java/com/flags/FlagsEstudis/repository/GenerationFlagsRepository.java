package com.flags.FlagsEstudis.repository;

import org.springframework.data.repository.CrudRepository;
import com.flags.FlagsEstudis.model.GenerationFlag;

public interface GenerationFlagsRepository extends CrudRepository<GenerationFlag, String> {
	// List<Generation> findByLastName(String lastName);
}
