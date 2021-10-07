package com.wsiz.skiscanner.repository;

import com.wsiz.skiscanner.model.SkiResort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SkiResortRepository extends JpaRepository<SkiResort, Long> {

    List<SkiResort> getAllByDeletedFalse();
}
