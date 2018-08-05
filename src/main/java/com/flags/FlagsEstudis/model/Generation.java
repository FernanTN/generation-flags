package com.flags.FlagsEstudis.model;

//import java.util.Date;
import java.util.List;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;
import org.hibernate.validator.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import lombok.Data;

@Entity
@Data
@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
public class Generation {
	@Version
    @NotNull
    @JsonIgnore
    private int version; // Atribut per a la concurrencia
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@XmlAttribute
	// Clau primaria
	private String id;
	@XmlAttribute
	@NotBlank
	// Restriccions per a la mida del nom
	@Size(min=1, max=30, message="La mida ha d'estar entre 1 i 30 caràcters")
	private String name;
	@XmlAttribute
	// Restriccio per nomes inserir un tipus data
	@Pattern(regexp = "[0-9-]+|[-]", message = "Només s'admeten dates")
	private String year;
	@XmlAttribute
	// Restriccions per al tipus mode
	@Pattern(regexp = "Normal|Transicio|[-]", message = "Només pot ser 'Normal' o 'Transicio'")
	private String mode;
	
	@OneToMany(mappedBy = "idGen", cascade = CascadeType.ALL)
	// Clau forana
	private List<GenerationFlag> flags;
	
	@JsonIgnore
    private int upD;		// Atribut per fer que JPA actualitzi el atribut version
	
	protected Generation() {}
	
	public Generation(String name, String year, String mode, List<GenerationFlag> flags) {
		this.name = name;
		this.year = year;
		this.mode = mode;
		this.flags = flags;
	}
}
