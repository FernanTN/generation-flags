package com.flags.FlagsEstudis.repository;

import java.util.Collection;

import org.springframework.data.repository.CrudRepository;
import com.flags.FlagsEstudis.model.Generation;

//public interface GenerationRepository extends CrudRepository<Generation, String>{
public interface GenerationRepository extends CrudRepository<Generation, String>{
    //List<Generation> findByLastName(String lastName);
	Collection<Generation> findAll();
	Generation findByName(String name);
}
