import 'dart:convert';
import 'package:http/http.dart' as http;

class PedidoService {
  final String baseUrl = "http://localhost:3000/pedidos";

  //listar todos os pedidos
  Future<List> getPedidos() async {
    final response = await http.get(Uri.parse(baseUrl));

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Error ao carregar pedidos');
    }
  }

// burcar pedido pelo id
  Future<Map<String, dynamic>> getPedidosById(int id) async {
    final response = await http.get(Uri.parse('$baseUrl/$id'));

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else if (response.statusCode == 404) {
      throw Exception('Peidos não encontrado');
    } else {
      throw Exception('Error ao carregar pedidos');
    }
  }

  Future<void> addPedido(Map<String, dynamic> pedido) async {
    final response = await http.post(
      Uri.parse(baseUrl),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(pedido),
    );
    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('Erro ao criar pedido');
    }
  }

  Future<void> updateStatus(int id, String status) async {
    final response = await http.put(
      Uri.parse('$baseUrl/$id'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'status': status}),
    );

    if (response.statusCode != 200 && response.statusCode != 204) {
      throw Exception('Erro ao atualizar status do pedido');
    }
  }

  Future<void> deletePedido(int id) async {
    final response = await http.delete(Uri.parse('$baseUrl/$id'));

    if (response.statusCode != 200) {
      throw Exception('Erro ao excluir pedido');
    }
  }
}
