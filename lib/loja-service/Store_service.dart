import 'dart:convert';
import 'package:http/http.dart' as http;

class StoreService {
  final String baseUrl =
      'http://localhost:3000/donos'; // Endpoint de lojas (donos)

  /// 🔍 Lista os detalhes de um único dono
  Future<Map<String, dynamic>> getDonoDetails(int id) async {
    final response = await http.get(Uri.parse('$baseUrl/$id'));
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Erro ao carregar detalhes do dono');
    }
  }

  /// ➕ Cria um novo dono (loja)
  Future<void> createDono(Map<String, dynamic> donoData) async {
    final response = await http.post(
      Uri.parse(baseUrl),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(donoData),
    );
    if (response.statusCode != 200) {
      throw Exception('Erro ao criar dono');
    }
  }

  /// 🔄 Atualiza as informações do dono
  Future<void> updateDono(int id, Map<String, dynamic> donoData) async {
    final response = await http.put(
      Uri.parse('$baseUrl/$id'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(donoData),
    );
    if (response.statusCode != 200) {
      throw Exception('Erro ao atualizar dono');
    }
  }

  /// ❌ Exclui um dono
  Future<void> deleteDono(int id) async {
    final response = await http.delete(Uri.parse('$baseUrl/$id'));
    if (response.statusCode != 200) {
      throw Exception('Erro ao excluir dono');
    }
  }

  /// 🔑 Realiza o login de um dono
  Future<Map<String, dynamic>> loginDono(String email, String senha) async {
    final response = await http.post(
      Uri.parse('$baseUrl/login'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'email': email, 'senha': senha}),
    );
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Erro ao realizar login');
    }
  }
}
