function criarListaAno() {
	let ano = document.getElementById("ano")
	let fim = new Date().getFullYear()
	let option = document.createElement("option")
	option.value = ""
	option.text = "Ano"
	option.setAttribute("disabled", "")

	ano.appendChild(option)
	for (let c = 2010; c < fim + 10; c++) {
		let option = document.createElement("option")
		option.value = c
		option.text = c
		if (c == fim) {
			option.setAttribute("selected", "")
		}
		ano.appendChild(option)
	}
}

criarListaAno()

class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor) {
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}
}

function cadastrarDespesa() {
	let ano = document.getElementById("ano")
	let mes = document.getElementById("mes")
	let dia = document.getElementById("dia")
	let tipo = document.getElementById("tipo")
	let descricao = document.getElementById("descricao")
	let valor = document.getElementById("valor").value
	valor.replace(",", ".")

	if (ano.value == "" || mes.value == "" || dia.value == "" || tipo.value == "" || descricao.value == "" || valor == "") {
		//verifica qual input esta vazio
		document.querySelectorAll("input").forEach(input => {
			//o input que estiver vazio vai cair aq
			if (input.value == "" || input == "") {
				input.classList.add("input-vazio")

				//adiciona um evento que observa se foi preenchido algum valor no input e remove a classe .input-vazio
				input.addEventListener("input", function () {
					input.classList.remove("input-vazio")
				})
			}
		})

		document.querySelectorAll("select").forEach(select => {
			if (select.value == "") {
				select.classList.add("input-vazio")

				select.addEventListener("input", function () {
					select.classList.remove("input-vazio")
				})
			}
		})

		window.alert("Estes campos devem conter informações")
	} else {
		let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor)
		gravarDespesa(despesa)
	}
}

function gravarDespesa(literalObject) {
	localStorage.setItem("despesa", JSON.stringify(literalObject))
}
