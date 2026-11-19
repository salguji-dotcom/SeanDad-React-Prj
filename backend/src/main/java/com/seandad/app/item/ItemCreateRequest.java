package com.seandad.app.item;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ItemCreateRequest(
        @NotBlank @Size(max = 100) String name
) {
}
