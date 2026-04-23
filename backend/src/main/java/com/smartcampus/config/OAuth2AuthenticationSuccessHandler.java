package com.smartcampus.config;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.smartcampus.model.User;
import com.smartcampus.service.UserService;
import com.smartcampus.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired private JwtUtil jwtUtil;
    @Autowired private UserService userService;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email    = oAuth2User.getAttribute("email");
        String name     = oAuth2User.getAttribute("name");
        String googleId = oAuth2User.getAttribute("sub");

        User user = userService.findOrCreateOAuthUser("GOOGLE", googleId, email, name);
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        String redirectUrl = frontendUrl + "/oauth2/callback"
            + "?token="  + URLEncoder.encode(token,          StandardCharsets.UTF_8)
            + "&name="   + URLEncoder.encode(user.getName(),  StandardCharsets.UTF_8)
            + "&email="  + URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8)
            + "&role="   + URLEncoder.encode(user.getRole().name(), StandardCharsets.UTF_8)
            + "&id="     + user.getId();

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
