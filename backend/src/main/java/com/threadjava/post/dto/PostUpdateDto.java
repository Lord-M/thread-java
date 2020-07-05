package com.threadjava.post.dto;

import com.threadjava.image.dto.ImageDto;
import com.threadjava.users.dto.UserShortDto;
import lombok.Data;

import java.util.Date;
import java.util.UUID;

@Data
public class PostUpdateDto {
    private UUID id;
    private String body;
    private ImageDto image;
    private UserShortDto user;
    private Date createdAt;
    private Date updatedAt;
}
