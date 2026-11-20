package com.seandad.app.code;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CodeService {

    private final CodeMapper codeMapper;

    @Transactional(readOnly = true)
    public List<ComCd> findByGroupCd(String groupCd) {
        return codeMapper.findByGroupCd(groupCd);
    }
}
