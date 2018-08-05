package com.flags.FlagsEstudis.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import org.hibernate.validator.constraints.NotBlank;

import java.time.LocalDate;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.adapters.XmlJavaTypeAdapter;

import lombok.Data;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.migesok.jaxb.adapter.javatime.*;

@Entity
@Data
@XmlAccessorType(XmlAccessType.NONE)
@Table(name = "GENERATIONFLAG")
public class GenerationFlag {
	@Version
    @NotNull
    @XmlAttribute
    private int version; // Atribut per a la concurrencia
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@XmlAttribute
	// Clau primaria
	private String id;
	@XmlAttribute
	@NotBlank
	// Restriccions per a la mida del nom
	@Size(min=2, max=30, message="La mida ha d'estar entre 1 i 30 caràcters")
	private String name;
	@XmlAttribute
	// Restriccions per a la mida del camp value
	@Size(max=100, message="La mida màxima és de 100 caràcters")
	private String value;
	@XmlAttribute
	@XmlJavaTypeAdapter(LocalDateXmlAdapter.class)
	@NotNull
	private LocalDate initDate;
	@XmlAttribute
	@XmlJavaTypeAdapter(LocalDateXmlAdapter.class)
	private LocalDate endDate;
	@JsonBackReference
	@ManyToOne
	@JoinColumn(name = "ID_GEN_ID")
	// Clau forana
	private Generation idGen;
	
	// Funcio per al parametre actiu
	@XmlAttribute(name = "active")
	public boolean isActive() {
		LocalDate now = LocalDate.now();
		return !((endDate != null && endDate.isBefore(now)) || (initDate != null && initDate.isAfter(now)));
	}

	protected GenerationFlag() {}
	
	public GenerationFlag(String name, LocalDate initDate, LocalDate endDate, String value, Generation idGen) {
		this.name = name;
		this.value = value;
		this.initDate = initDate;
		this.endDate = endDate;
		this.idGen = idGen;
	}
}
