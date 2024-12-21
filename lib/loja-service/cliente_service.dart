import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;

class ClienteService {
  final String baseUrl = 'http://localhost:3000/clientes';

  // Obter todos os clientes
  Future<List> getClientes() async {
    final response = await http.get(Uri.parse(baseUrl));
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Erro ao carregar clientes');
    }
  }

  // Obter cliente pelo ID
  Future<Map<String, dynamic>> getClienteById(int id) async {
    final response = await http.get(Uri.parse('$baseUrl/$id'));
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else if (response.statusCode == 404) {
      throw Exception('Cliente não encontrado');
    } else {
      throw Exception('Erro ao carregar cliente');
    }
  }

  // Adicionar novo cliente
  Future<void> addCliente(Map<String, dynamic> cliente) async {
    final response = await http.post(
      Uri.parse(baseUrl),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(cliente),
    );
    if (response.statusCode == 201) {
      print("Cliente criado com sucesso.");
    } else {
      throw Exception('Erro ao criar cliente');
    }
  }

  // Atualizar cliente
  Future<void> updateCliente(int id, Map<String, dynamic> cliente) async {
    final response = await http.put(
      Uri.parse('$baseUrl/$id'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(cliente),
    );
    if (response.statusCode == 200) {
      print("Cliente atualizado com sucesso.");
    } else {
      throw Exception('Erro ao atualizar cliente');
    }
  }

  // Excluir cliente
  Future<void> deleteCliente(int id) async {
    final response = await http.delete(Uri.parse('$baseUrl/$id'));
    if (response.statusCode == 204) {
      print("Cliente excluído com sucesso.");
    } else {
      throw Exception('Erro ao excluir cliente');
    }
  }

  // Fazer login do cliente
  Future<void> loginCliente(Map<String, dynamic> credentials) async {
    final response = await http.post(
      Uri.parse('$baseUrl/login'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(credentials),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      String token = data['token'];
      // Armazenar o token de forma segura
      final storage = FlutterSecureStorage();
      await storage.write(key: 'token', value: token);
      print("Token armazenado com sucesso.");
    } else {
      throw Exception('Erro ao fazer login');
    }
  }
}
