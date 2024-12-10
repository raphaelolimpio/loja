import 'dart:convert';
import 'package:http/http.dart' as http;

class ClienteService {
  final String baseUrl = 'http://localhost:3000/clientes';

  Future<List> getClientes() async {
    final response = await http.get(Uri.parse(baseUrl));

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Erro ao carregar clientes');
    }
  }

  Future<void> addCliente(Map<String, dynamic> cliente) async {
    final response = await http.post(
      Uri.parse(baseUrl),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(cliente),
    );
    if (response.statusCode != 200) {
      throw Exception('Erro ao carregar client');
    }
  }
}
