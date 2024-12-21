import 'dart:convert';
import 'package:http/http.dart' as http;

class ListaPedidoService {
  final String baseUrl = 'http://localhost:3000/pedidos';

  // 1. Listar todos os itens de um pedido
  Future<List> getItensPedido(int pedidoId) async {
    final response = await http
        .get(Uri.parse('$baseUrl/$pedidoId/itens')); // Corrigido para /itens

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Erro ao carregar itens do pedido');
    }
  }

  // 2. Adicionar um item ao pedido
  Future<void> addItemPedido(int pedidoId, Map<String, dynamic> item) async {
    final response = await http.post(
      Uri.parse('$baseUrl/$pedidoId/itens'), // Corrigido para /itens
      headers: {'Content-Type': 'application/json'},
      body: json.encode(item),
    );

    if (response.statusCode != 200) {
      throw Exception('Erro ao adicionar item ao pedido');
    }
  }

  // 3. Atualizar a quantidade de um item no pedido
  Future<void> updateItemPedido(
      int pedidoId, int itemId, Map<String, dynamic> item) async {
    final response = await http.put(
      Uri.parse(
          '$baseUrl/$pedidoId/itens/$itemId'), // Corrigido para /itens/$itemId
      headers: {'Content-Type': 'application/json'},
      body: json.encode(item),
    );

    if (response.statusCode != 200) {
      throw Exception('Erro ao atualizar item do pedido');
    }
  }

  // 4. Excluir um item do pedido
  Future<void> deleteItemPedido(int pedidoId, int itemId) async {
    final response = await http.delete(Uri.parse(
        '$baseUrl/$pedidoId/itens/$itemId')); // Corrigido para /itens/$itemId

    if (response.statusCode != 200) {
      throw Exception('Erro ao excluir item do pedido');
    }
  }
}
