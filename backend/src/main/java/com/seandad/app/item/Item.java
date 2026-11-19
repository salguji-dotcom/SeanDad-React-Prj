package com.seandad.app.item;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Item {
    private Long id;
    private String name;
    private LocalDateTime createdAt;
}
