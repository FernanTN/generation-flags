package com.flags.FlagsEstudis.model;

import java.util.List;

import javax.xml.bind.annotation.XmlAttribute;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class YearMode {
	@XmlAttribute
	private List<String> years;
	@XmlAttribute
	private List<String> mode;
}
