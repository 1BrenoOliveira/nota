package com.dev.breno.Note_Management.controllers;

import java.math.BigDecimal;
import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
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

import com.dev.breno.Note_Management.dtos.ErroDevalidacaoDto;
import com.dev.breno.Note_Management.models.Cliente;
import com.dev.breno.Note_Management.models.Item;
import com.dev.breno.Note_Management.models.Nota;
import com.dev.breno.Note_Management.models.Produto;
import com.dev.breno.Note_Management.repostiories.ClienteRepository;
import com.dev.breno.Note_Management.repostiories.ItemRepository;
import com.dev.breno.Note_Management.repostiories.NotaRepository;
import com.dev.breno.Note_Management.repostiories.ProdutoRepository;
import com.dev.breno.Note_Management.specifications.SpecificationNota;
import com.dev.breno.Note_Management.util.DataUtil;

@RestController
@RequestMapping("/nota")
@CrossOrigin(origins = "http://localhost:4200")//angular
public class NotaController {

	@Autowired
	private ProdutoRepository produtoRepository;
	@Autowired
	public ClienteRepository clienteRepository;
	@Autowired
	public NotaRepository notaRepository;
	@Autowired
	public ItemRepository itemRepository;

	@GetMapping
	public List<Nota> listarTodas(String cliente, String dataEmissao) {
			List<Nota> notas;
			if (cliente == null && dataEmissao == null)notas = notaRepository.findAll();
			else notas = notaRepository.findAll(Specification.where(SpecificationNota.clienteNome(cliente))
						.or(SpecificationNota.dataEmissao(DataUtil.converterEmLocalDate(dataEmissao))));
			return notas;
	}

	@PostMapping
	public ResponseEntity<?> cadastrar(@RequestBody @Valid Nota nota, UriComponentsBuilder uriBuilder) {
		Cliente cliente;
		try {
			cliente = clienteRepository.findById(nota.getCliente().getId()).get();
		} catch (NoSuchElementException e) {
			ErroDevalidacaoDto erro = new ErroDevalidacaoDto("Cliente", "Este cliente não está registrado");
			return ResponseEntity.badRequest().body(erro);
		}
		if(nota.getDataEmissao()==null) {
			nota.setDataEmissao(LocalDate.now());
		}
		URI uri = uriBuilder.path("/nota/{id}").buildAndExpand(nota.getId()).toUri();
		nota.setCliente(cliente);
		try {
			nota.setValorTotal(carregarDadosItem(nota));
			if(nota.getItens().isEmpty()) {
				ErroDevalidacaoDto erro = new ErroDevalidacaoDto("Itens", "A Nota precisa ter pelo menos um item");
				return ResponseEntity.badRequest().body(erro);
			}else {
				notaRepository.save(nota);
				setarNotaEmItens(nota);
				itemRepository.saveAll(nota.getItens());
			}
		} catch (NoSuchElementException e) {
			ErroDevalidacaoDto erro = new ErroDevalidacaoDto("Produto", "Algum produto informado não está registrado");
			return ResponseEntity.badRequest().body(erro);
		} catch (Exception e) {
			ErroDevalidacaoDto erro = new ErroDevalidacaoDto("Sistema",
					"O Sistema está indisponivel no momento. Tente mais tarde!");
			return ResponseEntity.badRequest().body(erro);
		}
		return ResponseEntity.created(uri).body(nota);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Nota> detalhar(@PathVariable("id") long id) {
		Optional<Nota> optional = notaRepository.findById(id);
		if (optional.isPresent()) {
			Nota nota = optional.get();
			nota.setItens(itemRepository.findByNota(nota));
			return ResponseEntity.ok(nota);
		}
		return ResponseEntity.notFound().build();
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<?> atualizarNota(@PathVariable("id") long id, @RequestBody Nota form) {
		Optional<Nota> optional = notaRepository.findById(id);
		if (optional.isPresent()) {
			Nota nota = optional.get();
			if (form.getCliente() != null) {
				Optional<Cliente> cliente = clienteRepository.findById((form.getCliente().getId()));
				if (cliente.isPresent()) {
					nota.setCliente(cliente.get());
				} else {
					ErroDevalidacaoDto erro = new ErroDevalidacaoDto("Cliente", "Este cliente não está registrado");
					return ResponseEntity.badRequest().body(erro);
				}
			}
			notaRepository.save(nota);
			return ResponseEntity.ok().body(nota);
		}
		return ResponseEntity.notFound().build();
	}
	

	@DeleteMapping("/{id}")
	public ResponseEntity<?> excluir(@PathVariable("id") long id) {
		Optional<Nota> optional = notaRepository.findById(id);
		if (optional.isPresent()) {
			List<Item> lista = itemRepository.findByNota(optional.get());
			try {
				itemRepository.deleteAll(lista);
				notaRepository.deleteById(id);
				return ResponseEntity.ok().build();
			}catch(Exception e){
				ErroDevalidacaoDto erro = new ErroDevalidacaoDto(" Erro", "Não é possivel excluir a nota no momento...tente mais tarde!");
				return ResponseEntity.badRequest().body(erro);
			}
			
		}
		return ResponseEntity.notFound().build();
	}

	@PostMapping("/{idNota}/item/adicionar")
	public ResponseEntity<?> adicionarItem(@PathVariable("idNota") long id, @RequestBody @Valid Item item) {
		Optional<Nota> optional = notaRepository.findById(id);
		if (optional.isPresent()) {
			Nota nota = optional.get();
			List<Item> lista = nota.getItens();
			System.out.println(item);
			Optional<Produto> produto = produtoRepository.findById(item.getProduto().getId());
			if(produto.isPresent()) {
				item.setProduto(produto.get());
				item.setValorTotalItem(produto.get().getValorUnitario().multiply(new BigDecimal(item.getQuantidade())));
			}else {
				ErroDevalidacaoDto erro = new ErroDevalidacaoDto("Produto", "Produto " + item.getProduto().getId() + " não encontrada");
				return ResponseEntity.badRequest().body(erro);
			}
			lista.add(item);
			nota.setItens(lista);
			nota.setValorTotal(nota.getValorTotal().add(item.getValorTotalItem()));
			item.setNota(nota);

			notaRepository.save(nota);
			itemRepository.save(item);

			return ResponseEntity.ok().body(nota);
		}
		return ResponseEntity.notFound().build();
	}

	
	@DeleteMapping("/{idNota}/item/{idItem}")
	public ResponseEntity<?> deletarItem(@PathVariable("idNota") long idNota, @PathVariable("idItem") long idItem) {
		Optional<Nota> optionalNota = notaRepository.findById(idNota);
		Optional<Item> optionalItem = itemRepository.findById(idItem);

		if (optionalItem.isPresent() && optionalNota.isPresent()) {
			Item item = optionalItem.get();
			if (idNota == item.getNota().getId()) {
				itemRepository.deleteById(idItem);
				return ResponseEntity.ok().build();
			}
			ErroDevalidacaoDto erro = new ErroDevalidacaoDto("NOTA e ITEM", "Este item não faz parte desta nota");
			return ResponseEntity.badRequest().body(erro);
		}
		return ResponseEntity.notFound().build();
	}

	
	
	
	private void setarNotaEmItens(Nota nota) {
		for (Item item : nota.getItens()) {
			item.setNota(nota);
		}
	}

	private BigDecimal carregarDadosItem(Nota nota) {
		BigDecimal totalDaNota = new BigDecimal(0);
		for (Item item : nota.getItens()) {
			Produto produto = produtoRepository.findById(item.getProduto().getId()).get();
			item.setProduto(produto);
			BigDecimal valorTotalItem = item.getProduto().getValorUnitario()
					.multiply(new BigDecimal(item.getQuantidade()));
			item.setValorTotalItem(valorTotalItem);
			totalDaNota = totalDaNota.add(valorTotalItem);
		}
		return totalDaNota;
	}
	

}
