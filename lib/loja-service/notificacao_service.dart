import 'dart:convert';
import 'package:http/http.dart' as http;

class NotificacaoService {
  final String baseUrl = 'http://localhost:3000/notificacoes';

  /// 🔍 Lista todas as notificações
  Future<List> getNotificacoes() async {
    final response = await http.get(Uri.parse(baseUrl));
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Erro ao carregar notificações');
    }
  }

  /// ➕ Adiciona uma nova notificação
  Future<void> addNotificacao(Map<String, dynamic> notificacao) async {
    final response = await http.post(
      Uri.parse(baseUrl),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(notificacao),
    );
    if (response.statusCode != 201) {
      throw Exception('Erro ao criar notificação');
    }
  }

  /// 🔄 Atualiza o status da notificação (marcar como lida/não lida)
  Future<void> updateStatus(int id, bool lida) async {
    final response = await http.put(
      Uri.parse('$baseUrl/$id'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'lida': lida}),
    );
    if (response.statusCode != 200) {
      throw Exception('Erro ao atualizar status da notificação');
    }
  }

  /// ❌ Exclui uma notificação específica
  Future<void> deleteNotificacao(int id) async {
    final response = await http.delete(Uri.parse('$baseUrl/$id'));
    if (response.statusCode != 200) {
      throw Exception('Erro ao excluir notificação');
    }
  }

  /// 🚫 Exclui todas as notificações
  Future<void> deleteTodasNotificacoes() async {
    final response = await http.delete(Uri.parse(baseUrl));
    if (response.statusCode != 200) {
      throw Exception('Erro ao excluir todas as notificações');
    }
  }
}
