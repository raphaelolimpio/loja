import 'dart:convert';
import 'package:http/http.dart' as http;

class CarrinhoService {
  final String baseUrl = 'http://localhost:3000/carrinho';

  Future<List> getCarrinho() async {
    final response = await http.get(Uri.parse(baseUrl));
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Erro ao carregar carrinho');
    }
  }

  Future<void> addItemAoCarrinho(Map<String, dynamic> item) async {
    final response = await http.post(
      Uri.parse(baseUrl),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(item),
    );
    if (response.statusCode != 200) {
      throw Exception('Erro ao adicionar item ao carrinho');
    }
  }

  Future<void> deleteItemDoCarrinho(int id) async {
    final response = await http.delete(Uri.parse('$baseUrl/$id'));
    if (response.statusCode != 200) {
      throw Exception('Erro ao excluir item do carrinho');
    }
  }
}
