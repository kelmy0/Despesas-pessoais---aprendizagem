//cria os anos automaticamente e poe o ano, mes e dia automaticamente
function criarListaAno(setar) {
	let ano = document.getElementById("ano")
	let fim = new Date().getFullYear()

	setTimeout(() => {
		for (let c = 2010; c < fim + 10; c++) {
			let option = document.createElement("option")
			option.value = c
			option.text = c
			if (c == fim && setar === true) {
				option.setAttribute("selected", "")
				document.getElementById("ano").classList.remove("input-vazio")

				//botar o dia e o mes automaticamente
				let mes = new Date().getMonth() + 1
				let dia = new Date().getDate()

				document.getElementById("mes").value = mes
				document.getElementById("dia").value = dia
				document.getElementById("mes").classList.remove("input-vazio")
				document.getElementById("dia").classList.remove("input-vazio")
			}
			ano.appendChild(option)
		}
	}, 1500)
}

//gravar despesa
class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor) {
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	validarDados() {
		for (let dado in this) {
			if (this[dado] == "" || this[dado] == undefined || this[dado] == null) {
				return false
			}
		}
		return true
	}
}

class Bd {
	gravarDespesa(literalObject) {
		let tamanho = localStorage.length

		for (let i = 1; i <= tamanho; i++) {
			if (localStorage.getItem(i) === null) {
				tamanho++
			}
		}

		localStorage.setItem(tamanho + 1, JSON.stringify(literalObject))
	}

	recuperarRegistros() {
		//array despesas
		let despesas = Array()

		let tamanho = localStorage.length

		for (let c = 1; c <= tamanho; c++) {
			let item = JSON.parse(localStorage.getItem(c))

			if (localStorage.getItem(c) != null) {
				item.id = c
				despesas.push(item)
				continue
			}
			tamanho++
		}

		return despesas
	}

	pesquisar(despesas) {
		let despesasFiltradas = this.recuperarRegistros()
		//ano
		if (despesas.ano != "") {
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesas.ano)
		}
		//mes
		if (despesas.mes != "") {
			despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesas.mes)
		}

		//dia
		if (despesas.dia != "") {
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesas.dia)
		}

		if (despesas.tipo != "") {
			despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesas.tipo)
		}

		if (despesas.descricao != "") {
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesas.descricao)
		}

		if (despesas.valor != "") {
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesas.valor)
		}

		return despesasFiltradas
	}

	remover(id) {
		localStorage.removeItem(id)
	}
}

let bd = new Bd()

function cadastrarDespesa() {
	let ano = document.getElementById("ano")
	let mes = document.getElementById("mes")
	let dia = document.getElementById("dia")
	let tipo = document.getElementById("tipo")
	let descricao = document.getElementById("descricao")
	let valor = document.getElementById("valor").value
	valor.replace(",", ".")

	let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor)
	//validar dados
	if (despesa.validarDados() == true) {
		try {
			bd.gravarDespesa(despesa)
			exibirMsgEscondida("msg-escondida", "bg-success", "Despesa adicionada com sucesso")

			document.querySelectorAll("input").forEach(input => {
				if (input.id != "dia") {
					input.value = ""
				}
			})

			document.getElementById("tipo").value = ""
		} catch (erro) {
			if (erro.name === "SecurityError" && erro.message.includes("localStorage") && erro.message.includes("Access is denied")) {
				exibirMsgEscondida("msg-escondida", "bg-danger", "Erro ao salvar. Desbloqueie os cookies")
			}
		}
	} else {
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

		//verifica qual select esta vazio
		document.querySelectorAll("select").forEach(select => {
			if (select.value == "") {
				select.classList.add("input-vazio")

				//adiciona um evento que observa se foi preenchido algum valor no input e remove a classe .input-vazio
				select.addEventListener("input", function () {
					select.classList.remove("input-vazio")
				})
			}
		})

		if (window.innerWidth > 800) {
			$("#msg-erro-modal").modal("show")
		} else {
			exibirMsgEscondida("msg-escondida", "bg-danger", "Estes campos devem ser preenchidos")
		}
	}
}

//exibir msg
let time = null
function exibirMsgEscondida(elementId, classe, texto) {
	document.getElementById(elementId).classList.add(classe)
	document.getElementById(elementId).innerHTML = texto

	fadeIn(elementId)

	if (time) {
		clearTimeout(time)
	}

	time = setTimeout(function () {
		fadeOut(elementId, classe)
	}, 5000)
}

//efeito fadeIN
function fadeIn(elementId) {
	document.getElementById(elementId).style.opacity = 0
	document.getElementById(elementId).classList.remove("d-none")
	document.getElementById(elementId).classList.add("d-flex")

	let opacidade = 0

	let tempoFadeIn = setInterval(function () {
		if (opacidade >= 1) {
			clearInterval(tempoFadeIn)
		}

		let id = elementId
		document.getElementById(id).style.opacity = opacidade.toString()

		opacidade += 0.1
	}, 32)
}

//efeito fadeOut
function fadeOut(elementId, removeClass) {
	let opacidade = 1
	let tempoFadeIn = setInterval(function () {
		if (opacidade <= 0) {
			clearInterval(tempoFadeIn)
			document.getElementById(elementId).classList.remove("d-flex")
			document.getElementById(elementId).classList.add("d-none")
			document.getElementById(elementId, removeClass).classList.remove(removeClass)
			time = null
		}

		let id = elementId
		document.getElementById(id).style.opacity = opacidade.toString()

		opacidade -= 0.1
	}, 32)
}

//carregar lista despesas
function carregarListaDespesas(despesas = Array(), filtro = false) {
	if (despesas.length == 0 && !filtro) {
		despesas = bd.recuperarRegistros()
	}

	let listaDespesasTable = document.getElementById("listaDespesasTable")
	listaDespesasTable.innerHTML = ""

	//pecorrer depesaslistando tudo
	despesas.forEach(despesa => {
		//criando linha <tr>
		let linha = listaDespesasTable.insertRow()

		//inserir valores na linha (colunas) <td>
		linha.insertCell(0).innerHTML = `${despesa.dia}/${despesa.mes}/${despesa.ano}`

		switch (parseInt(despesa.tipo)) {
			case 1:
				linha.insertCell(1).innerHTML = "Alimentação"
				break

			case 2:
				linha.insertCell(1).innerHTML = "Educação"
				break

			case 3:
				linha.insertCell(1).innerHTML = "Lazer"
				break

			case 4:
				linha.insertCell(1).innerHTML = "Saúde"
				break

			case 5:
				linha.insertCell(1).innerHTML = "Transporte"
				break

			default:
				linha.insertCell(1).innerHTML = "Outro"
				break
		}

		linha.insertCell(2).innerHTML = despesa.descricao
		linha.insertCell(3).innerHTML = `R$${despesa.valor}`

		//criar botao exclusao
		let btn = document.createElement("button")
		btn.classList = "btn btn-danger w-100"
		btn.onclick = () => {
			let id = parseInt(btn.id.slice(-1))
			bd.remover(id)

			carregarListaDespesas([], false)
		}
		btn.id = "id_despesa_" + despesa.id
		let icon = document.createElement("i")
		icon.classList = "fa-solid fa-trash"
		icon.tittle = "excluir esta despesa"
		btn.appendChild(icon)

		if (window.innerWidth > 410) {
			linha.insertCell(4).appendChild(btn)
		} else {
			let linhaExclusao = listaDespesasTable.insertRow()
			linhaExclusao.insertCell(0).appendChild(btn)
		}
	})

	/*
	if (despesas.length > 1 && !filtro) {
		document.getElementById("rodape").classList.remove("rodape")
		document.getElementById("rodape").classList.add("rodape1")
	} else if (despesas.length > 1 && filtro) {
		document.getElementById("rodape").classList.remove("rodape")
		document.getElementById("rodape").classList.add("rodape1")
	} else if (despesas.length <= 1 && filtro) {
		document.getElementById("rodape").classList.remove("rodape1")
		document.getElementById("rodape").classList.add("rodape")
	} else {
		document.getElementById("rodape").classList.remove("rodape1")
		document.getElementById("rodape").classList.add("rodape")
	}*/

	posicionarFooter()
}

function pegarAltura() {
	let altura = document.documentElement.scrollHeight
	return altura
}

function pesquisarDespesa() {
	let ano = document.getElementById("ano").value
	let mes = document.getElementById("mes").value
	let dia = document.getElementById("dia").value
	let tipo = document.getElementById("tipo").value
	let descricao = document.getElementById("descricao").value
	let valor = document.getElementById("valor").value

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

	let listaDespesasFiltradas = bd.pesquisar(despesa)
	carregarListaDespesas(listaDespesasFiltradas, true)
}

function excluirTudo() {
	localStorage.clear()
	location.reload()
}

function excluirSelecionado(elemento) {}

function posicionarFooter() {
	let alturaJanela = window.innerHeight
	let alturaRodape = document.getElementById("rodape").clientHeight
	console.log(window.innerHeight, pegarAltura() - alturaRodape)
	if (alturaJanela < pegarAltura()) {
		document.getElementById("rodape").classList.remove("rodape1")
		document.getElementById("rodape").classList.add("rodape")
		console.log("janela menor")
	} else {
		document.getElementById("rodape").classList.remove("rodape")
		document.getElementById("rodape").classList.add("rodape1")
	}
}
posicionarFooter()
