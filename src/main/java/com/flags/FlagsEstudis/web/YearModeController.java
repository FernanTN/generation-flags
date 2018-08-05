package com.flags.FlagsEstudis.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.flags.FlagsEstudis.model.YearMode;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/year-mode")
@Slf4j
public class YearModeController {
	
    	private static Map<String, YearMode> yearsmodes;

    	@RequestMapping
    	public ResponseEntity<List<YearMode>> showAll() {
    		return new ResponseEntity<>(new ArrayList<YearMode>(yearsmodes.values()), HttpStatus.OK);
    	}

   	//Dades en memoria dels anys 16-17, 17-18 i 18-19 i el mode normal o transicio
		static {
			yearsmodes = new HashMap<>();
			YearMode yearmode = new YearMode();
			List<String> year = new ArrayList<String>();
			year.add("2016-17");
			year.add("2017-18");
			year.add("2018-19");
			yearmode.setYears(year);
			
			List<String> mode = new ArrayList<String>();
			mode.add("Normal");
			mode.add("Transicio");
			yearmode.setMode(mode);
			
			yearsmodes.put("1", yearmode);
		}
}