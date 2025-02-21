package com.dev.breno.Note_Management.models;

import java.math.BigDecimal;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Item {

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@ManyToOne
	private Nota nota;

	private String sequencial;

	@ManyToOne
	private Produto produto;

	private int quantidade;

	private BigDecimal valorTotalItem;




	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getSequencial() {
		return sequencial;
	}
	public void setSequencial(String sequencial) {
		this.sequencial = sequencial;
	}
	public Produto getProduto() {
		return produto;
	}
	public void setProduto(Produto produto) {
		this.produto = produto;
	}
	public int getQuantidade() {
		return quantidade;
	}
	public void setQuantidade(int quantidade) {
		this.quantidade = quantidade;
	}
	public BigDecimal getValorTotalItem() {
		return valorTotalItem;
	}
	public void setValorTotalItem(BigDecimal valorTotalItem) {
		this.valorTotalItem = valorTotalItem;
	}
	public Nota getNota() {
		return nota;
	}
	public void setNota(Nota nota) {
		this.nota = nota;
	}
	@Override
	public String toString() {
		return "Item [id=" + id + ", sequencial=" + sequencial + ", produto=" + produto + ", quantidade=" + quantidade
				+ ", valorTotalItem=" + valorTotalItem +"]";
	}
	
	
	
	
}
