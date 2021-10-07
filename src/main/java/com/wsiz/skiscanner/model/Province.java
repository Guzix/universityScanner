package com.wsiz.skiscanner.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Province {
    DOLNOSLASKIE("Dolnośląskie"),
    KUJAWSKO_POMORSKIE("Kujawsko-pomorskie"),
    LUBELSKIE("Lubelskie"),
    LODZKIE("Łódzkie"),
    MALOPOLSKIE("Małopolskie"),
    MAZOWIECKIE("Mazowieckie"),
    OPOLSKIE("Opolskie"),
    PODKARPACKIE("Podkarpackie"),
    PODLASKIE("Podlaskie"),
    POMORSKIE("Pomorskie"),
    SLASKIE("Śląskie"),
    SWIETOKRZYSKIE("Świętokrzyskie"),
    WARMINSKO_MAZURSKIE("Warmińsko-mazurskie"),
    WIELKOPOLSKIE("Wielkopolskie"),
    ZACHODNIOPOMORSKIE("Zachodniopomorskie");


    public final String name;
}
