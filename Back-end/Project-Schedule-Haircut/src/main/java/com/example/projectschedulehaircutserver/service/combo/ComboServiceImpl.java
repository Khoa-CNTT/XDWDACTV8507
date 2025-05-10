package com.example.projectschedulehaircutserver.service.combo;

import com.example.projectschedulehaircutserver.dto.ComboDTO;
import com.example.projectschedulehaircutserver.entity.Combo;
import com.example.projectschedulehaircutserver.exeption.CustomerException;
import com.example.projectschedulehaircutserver.repository.ComboRepo;
import com.example.projectschedulehaircutserver.response.ComboManagementResponse;
import com.example.projectschedulehaircutserver.response.CustomerManagementResponse;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ComboServiceImpl implements ComboService{
    private final ComboRepo comboRepo;

    @Override
    public Set<ComboDTO> findAllCombo() {
        return comboRepo.findAllCombo();
    }

    @Override
    public Set<ComboDTO> findAllComboByCategoryId(Integer categoryId) {
        return comboRepo.findAllComboByCategoryId(categoryId).stream()
                .sorted(Comparator.comparing(ComboDTO::getId))
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    @Override
    public Set<ComboManagementResponse> getAllCombos() {
        try {
            List<Combo> combos = comboRepo.getAllCombos();
            if (combos.isEmpty()) {
                throw new NoSuchElementException("Danh sách combo trống");
            }

            Set<ComboManagementResponse> result = combos.stream()
                    .map(c -> new ComboManagementResponse(
                            c.getId(),
                            c.getName(),
                            c.getPrice(),
                            c.getImage(),
                            c.getServices().stream().map(service -> service.getId()).collect(Collectors.toSet())
                    ))
                    .collect(Collectors.toSet());

            return result;
        } catch (RuntimeException ex) {
            throw new RuntimeException("Lỗi truy vấn dữ liệu", ex);
        }
    }

}
