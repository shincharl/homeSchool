package homeSchool.com.controller;

import homeSchool.com.dto.JusoItemDTO;
import homeSchool.com.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/address")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping("/search")
    public List<JusoItemDTO> search(@RequestParam String keyword){
        return addressService.searchAddress(keyword);
    }
}
