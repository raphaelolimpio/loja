import 'dart:convert';
import 'package:http/http.dart' as http;

class FavoritoService {
  final String baseUrl = 'http://localhost:3000/favoritos';

  /// 🔍 Lista todos os favoritos
  Future<List> getFavoritos() async {
    final response = await http.get(Uri.parse(baseUrl));
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Erro ao carregar favoritos');
    }
  }

  /// ➕ Adiciona um item aos favoritos
  Future<void> addFavorito(Map<String, dynamic> favorito) async {
    final response = await http.post(
      Uri.parse(baseUrl),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(favorito),
    );
    if (response.statusCode != 201) {
      throw Exception('Erro ao adicionar item aos favoritos');
    }
  }

  /// ❌ Remove um item dos favoritos
  Future<void> deleteFavorito(int id) async {
    final response = await http.delete(Uri.parse('$baseUrl/$id'));
    if (response.statusCode != 200) {
      throw Exception('Erro ao excluir item dos favoritos');
    }
  }

  /// 🔎 Verifica se um item já está nos favoritos
  Future<bool> checkIfFavoritoExists(int produtoId) async {
    final response = await http.get(Uri.parse('$baseUrl/produto/$produtoId'));
    if (response.statusCode == 200) {
      return json.decode(response.body)['exists'] ?? false;
    } else if (response.statusCode == 404) {
      return false;
    } else {
      throw Exception('Erro ao verificar favorito');
    }
  }
}
