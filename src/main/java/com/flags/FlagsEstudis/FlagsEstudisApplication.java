package com.flags.FlagsEstudis;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.filter.ShallowEtagHeaderFilter;

import javax.servlet.Filter;

@SpringBootApplication
@ComponentScan
public class FlagsEstudisApplication {

	public static void main(String[] args) {
		SpringApplication.run(FlagsEstudisApplication.class, args);
	}
	
	@Bean
    public Filter filter(){
        ShallowEtagHeaderFilter filter = new ShallowEtagHeaderFilter();
        return filter;
    }
}
