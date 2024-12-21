import 'dart:convert';
import 'package:http/http.dart' as http;

class ProdutoService {
  final String baseUrl = 'http://localhost:3000/produtos';

  Future<List> getProdutos() async {
    final response = await http.get(Uri.parse(baseUrl));
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Erro ao carregar produtos');
    }
  }

  Future<Map<String, dynamic>> getProdutoById(int id) async {
    final response = await http.get(Uri.parse('$baseUrl/$id'));
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else if (response.statusCode == 404) {
      throw Exception('Produto não encontrado');
    } else {
      throw Exception('Erro ao carregar produto');
    }
  }

  Future<void> addProduto(Map<String, dynamic> produto) async {
    final response = await http.post(
      Uri.parse(baseUrl),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(produto),
    );
    if (response.statusCode != 200) {
      throw Exception('Erro ao criar produto');
    }
  }

  Future<void> updateProduto(int id, Map<String, dynamic> produto) async {
    final response = await http.put(
      Uri.parse('$baseUrl/$id'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(produto),
    );
    if (response.statusCode != 200) {
      throw Exception('Erro ao atualizar produto');
    }
  }

  Future<void> deleteProduto(int id) async {
    final response = await http.delete(Uri.parse('$baseUrl/$id'));
    if (response.statusCode != 200) {
      throw Exception('Erro ao excluir produto');
    }
  }
}
