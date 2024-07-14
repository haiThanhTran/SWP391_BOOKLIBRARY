package com.example.demo.importBook;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface ImportBookRepository extends JpaRepository<ImportBook, Long> {

    @Query("SELECT ib FROM ImportBook ib WHERE ib.importDate BETWEEN :startDate AND :endDate")
    List<ImportBook> findAllByImportDateBetween(@Param("startDate") Date startDate, @Param("endDate") Date endDate);
}



