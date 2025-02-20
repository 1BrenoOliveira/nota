package com.dev.breno.Note_Management.util;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

public class PaginacaoUtil {
	

	
	public static PageRequest gerarPageable( String page, String size) {
		if (page == null)
			page = "0";
		if (size == null)
			size = "10";
		int pagina = Integer.parseInt(page);
		int tamanho = Integer.parseInt(size);
		PageRequest paginacao =  PageRequest.of(pagina,tamanho,Sort.by("id").descending());
		return paginacao;
	}
}
