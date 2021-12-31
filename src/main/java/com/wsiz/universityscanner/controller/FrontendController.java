package com.wsiz.universityscanner.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontendController {
    @RequestMapping(value = {"/"})
    public String indexPage() {
        return "index.html";
    }

    @RequestMapping(value = {"/{?:^(?!static|index|manifest|logo|files).*$}/**"})
    public String defaultMapping() {
        return "forward:/";
    }

}
