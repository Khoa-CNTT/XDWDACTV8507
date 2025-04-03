package com.example.projectschedulehaircutserver.service.combo;

import com.example.projectschedulehaircutserver.dto.ComboDTO;
import com.example.projectschedulehaircutserver.repository.ComboRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@AllArgsConstructor
public class ComboServiceImpl implements ComboService{
    private final ComboRepo comboRepo;

    @Override
    public Set<ComboDTO> findAllCombo() {
        return comboRepo.findAllCombo();
    }
}
