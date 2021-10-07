package com.wsiz.skiscanner.config;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.annotation.PostConstruct;

@Log4j2
@EnableJpaAuditing
@Configuration
public class WebConfig implements WebMvcConfigurer {




//        Session session = HibernateUtil.getSessionFactory().openSession();
//        session.beginTransaction();
//        session.createSQLQuery(sql).executeUpdate();
//        session.getTransaction().commit();
//        session.close();
//    }

//    @Override
//    public void addResourceHandlers(ResourceHandlerRegistry registry) {
//        registry
//                .addResourceHandler("/files/machine-calendar-task/**")
//                .addResourceLocations("file:///"+machineCalendarTaskPath.replace("\\","/"));
//
//        registry
//                .addResourceHandler("/files/local-erp-order/**")
//                .addResourceLocations("file:///"+localErpOrderPath.replace("\\","/"));
//    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000", "http://production.ims.mls")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .maxAge(3600);
    }
}
