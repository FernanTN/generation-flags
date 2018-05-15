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
    private int version;
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@XmlAttribute
	private String id;
	@XmlAttribute
	@NotBlank
	@Size(min=2, max=30, message="La mida ha d'estar entre 2 i 30 caràcters")
	private String name;
	@XmlAttribute
	@Pattern(regexp = "[0-9-]+|[-]", message = "Només s'admeten dates")
	private String year;
	@XmlAttribute
	@Pattern(regexp = "Normal|Transicio|[-]", message = "Només pot ser 'Normal' o 'Transicio'")
	private String mode;
	
	@OneToMany(mappedBy = "idGen", cascade = CascadeType.ALL)
	private List<GenerationFlag> flags;
	
	@JsonIgnore
    private int upD;
	
	protected Generation() {}
	
	public Generation(String name, String year, String mode, List<GenerationFlag> flags) {
		this.name = name;
		this.year = year;
		this.mode = mode;
		this.flags = flags;
	}
	
	@Override
	public String toString() {
		return String.format("Generation[id=%s, name='%s', flags='%s']", id, name, flags.toString());
	}
}
