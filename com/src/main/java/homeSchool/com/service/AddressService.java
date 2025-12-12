package homeSchool.com.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import homeSchool.com.dto.JusoItemDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {

    @Value("${juso.api.key}")
    private String apiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<JusoItemDTO> searchAddress(String keyword) {
        try {
            // API에서 금지된 특수 문자 및 SQL 예약어 제거
            String safeKeyword = keyword.replaceAll("[%=><\\[\\]]", "");
            String test = "대전";

            if(safeKeyword.trim().isEmpty() || safeKeyword.length() < 2){
                return new ArrayList<>();
            }

                String url = "http://business.juso.go.kr/addrlink/addrLinkApi.do"
                        + "?confmKey=" + apiKey
                        + "&keyword=" + safeKeyword
                        + "&currentPage=1"
                        + "&countPerPage=100"
                        + "&resultType=json";

                RestTemplate rt = new RestTemplate();
                String response = rt.getForObject(url, String.class);

                System.out.println("API RESPONSE = " + response);  // JSON 확인용

                // JSON 파싱
                JsonNode root = objectMapper.readTree(response);
                JsonNode jusoList = root.path("results").path("juso");

                List<JusoItemDTO> result = new ArrayList<>();

                for (JsonNode j : jusoList) {
                    String roadAddr = j.path("roadAddr").asText();
                    result.add(new JusoItemDTO(roadAddr));
                }

                return result;

        } catch (Exception e) {
            throw new RuntimeException("주소 검색 실패", e);
        }
    }


}
