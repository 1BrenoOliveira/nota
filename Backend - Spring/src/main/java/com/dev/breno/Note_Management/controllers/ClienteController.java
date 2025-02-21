package com.dev.breno.Note_Management.controllers;

import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import com.dev.breno.Note_Management.dtos.ClienteDto;
import com.dev.breno.Note_Management.forms.ClienteForm;
import com.dev.breno.Note_Management.models.Cliente;
import com.dev.breno.Note_Management.repostiories.ClienteRepository;
import com.dev.breno.Note_Management.specifications.SpecificationCliente;

@RestController
@RequestMapping("/cliente")
@CrossOrigin(origins = "http://localhost:4200")//angular
public class ClienteController {
	
	@Autowired
	private ClienteRepository clienteRepository;

	@GetMapping
	public List<ClienteDto> buscarTodos(String nome, String codigo){
		List<Cliente> clientes ;
		if(nome==null&&codigo==null) {
			clientes = clienteRepository.findAll();
		}else {
			clientes = clienteRepository.findAll(Specification.where(
					SpecificationCliente.nome(nome)
					.or(SpecificationCliente.codigo(codigo))));
		}
		return ClienteDto.converter(clientes);
	}
	
	@PostMapping
	public ClienteDto cadastrar(@RequestBody @Valid ClienteForm form, UriComponentsBuilder uriBuilder){
		Cliente cliente = form.converteEmCliente();
		Cliente clienteSalvo = clienteRepository.save(cliente);
		return new ClienteDto(clienteSalvo);
	}
	
	@GetMapping("/{id}")
	public ClienteDto detalhes(@PathVariable("id") long id){
		Optional<Cliente> optional = clienteRepository.findById(id);
		if(optional.isPresent() )return new ClienteDto(optional.get());
		return null;
	}
	
	@PutMapping("/{id}")
	public ClienteDto alterar(@PathVariable("id") long id, @RequestBody  ClienteForm form){
		Optional<Cliente> optional = clienteRepository.findById(id);
		if(optional.isPresent()){
			Cliente cliente = optional.get();
			if(form.getCodigo()!=null )cliente.setCodigo(form.getCodigo());
			if(form.getNome()!=null )cliente.setNome(form.getNome());
			clienteRepository.save(cliente);
			return new ClienteDto(cliente);
		}
		return null;
	}
	
	@DeleteMapping("/{id}")
	public void remover(@PathVariable("id") long id){
		clienteRepository.deleteById(id);
	}
	
	
	
}
